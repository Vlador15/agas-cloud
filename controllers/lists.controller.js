const ListCategory = require("../models/ListCategory");
const ListSubjects = require("../models/ListSubjects");
const ListThemes = require("../models/ListThemes");
const ListSubThemes = require("../models/ListSubThemes");

const ListUniversity = require("../models/ListUniversity");
const ListFaculties = require("../models/ListFaculties");

const lists = {
  category: ListCategory,
  subject: ListSubjects,
  themes: ListThemes,
  subthemes: ListSubThemes,

  university: ListUniversity,
  faculties: ListFaculties,
};

class Lists {
  /**
   * [GET]
   * Получение факультетов
   * Get university
   *
   * @returns {array}
   */
  async getUniversity(req, res) {
    try {
      const { ln } = req.query;
      console.log(ln);
      if (!ln) throw new Error(`Parameter not specified: "ln"`);

      let data = await ListUniversity.find({ language: ln }, "name");
      let result = new Set(data.map((x) => x.name));

      return res.status(200).json({ data: Array.from(result) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получение факультетов
   * Get faculties
   *
   * @returns {array}
   */
  async getFaculties(req, res) {
    try {
      const { ln, university } = req.query;
      if (!ln) throw new Error(`Parameter not specified: "ln"`);
      if (!university) throw new Error(`Parameter not specified: "university"`);

      let data = await ListFaculties.find(
        { language: ln, links: { $in: university } },
        "name"
      );
      let categories = new Set(data.map((x) => x.name));

      return res.status(200).json({ data: Array.from(categories) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получение категорий
   * Get category
   *
   * @returns {array}
   */
  async getCategory(req, res) {
    try {
      const { ln } = req.query;
      if (!ln) throw new Error(`Parameter not specified: "ln"`);

      let data = await ListCategory.find({ language: ln }, "name");
      let categories = new Set(data.map((x) => x.name));

      return res.status(200).json({ categories: Array.from(categories) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получение предметов
   * Get subjects
   *
   * @returns {array}
   */
  async getSubjects(req, res) {
    try {
      const { ln, category } = req.query;
      if (!ln) throw new Error(`Parameter not specified: "ln"`);
      if (!category) throw new Error(`Parameter not specified: "category"`);

      let data = await ListSubjects.find({
        language: ln,
        links: { $in: category },
      });
      let categories = new Set(data.map((x) => x.name));
      return res.status(200).json({ categories: Array.from(categories), data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получение тем
   * Get themes
   *
   * @returns {array}
   */
  async getThemes(req, res) {
    try {
      const { ln, subject } = req.query;
      if (!ln) throw new Error(`Parameter not specified: "ln"`);
      if (!subject) throw new Error(`Parameter not specified: "subject"`);

      let data = await ListThemes.find({
        language: ln,
        links: { $in: subject },
      });
      let result = new Set(data.map((x) => x.name));
      return res.status(200).json({ data: Array.from(result) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  /**
   * [GET]
   * Получение подтем
   * Get subthemes
   *
   * @returns {array}
   */
  async getSubThemes(req, res) {
    try {
      const { ln, theme } = req.query;
      if (!ln) throw new Error(`Parameter not specified: "ln"`);
      if (!theme) throw new Error(`Parameter not specified: "theme"`);

      let data = await ListSubThemes.find({
        language: ln,
        links: { $in: theme },
      });
      let result = new Set(data.map((x) => x.name));
      return res.status(200).json({ data: Array.from(result) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Загрузка предметов из json файла
   *
   * @returns {array}
   */
  async uploadJson(req, res) {
    try {
      let data = require("../data/subjects.json");

      if (data.length > 0) {
        for (let item of data) {
          // проверка наличия категории
          if (!(await ListCategory.findOne({ name: item.categoryName }))) {
            const object = {
              name: item.categoryName,
              language: item.language,
              description: "",
              links: [],
            };
            let result = await ListCategory.create(object);
            console.log(`Create category: "${result.name}"`);
          }

          // проверка наличия предмета
          if (await ListSubjects.findOne({ name: item.name })) {
            console.log(
              `[Error] Subject: "${item.name}" has already been created`
            );
          } else {
            const object = {
              name: item.name,
              language: item.language,
              description: "",
              links: [item.categoryName],
            };
            let result = await ListSubjects.create(object);
            console.log(`Create subject: "${result.name}"`);
          }
        }
      }

      res.status(200).json({ data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [POST]
   * Добавление элемент в справочник
   * Add item in list
   *
   * @returns {array}
   */
  async createItem(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      const data = req.body;
      const List = lists[data.list];
      if (!List) throw new Error("The list was not found");

      if (await List.findOne({ name: data.name }))
        throw new Error("The item has already been created");

      const object = {
        name: data.name,
        description: data.description || "",
        language: data.language,
        links: data.links || [],
      };

      let result = await List.create(object);

      res.status(200).json({ result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получить элемент из списка
   * Get item from list
   *
   * @returns {array}
   */
  async getItems(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      const data = req.query;
      const List = lists[data.list];
      if (!List) throw new Error("The list was not found");

      const result = await List.find({ language: data.language });
      res.status(200).json({ data: result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [PUT]
   * Обновить элемент из списка
   * Update item from list
   *
   * @returns {array}
   */
  async updateItemById(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      const data = req.body;
      const List = lists[data.list];
      if (!List) throw new Error("The list was not found");

      const list = await List.findOne({ _id: data.id });
      if (!list) throw new Error("List was not found");

      list.name = data.name || list.name;
      list.description = data.description || list.description;
      list.language = data.language || list.language;
      list.links = data.links || list.links;
      list.save();

      res.status(200).json({ data: list });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [DELETE]
   * Удалить элемент из списка
   * delete item from list
   *
   * @returns {array}
   */
  async deleteItemById(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      const data = req.query;
      const List = lists[data.list];
      if (!List) throw new Error("The list was not found");

      if (!(await List.findOne({ _id: data.id })))
        throw new Error("The item was not found");
      await List.deleteOne({ _id: data.id });

      res
        .status(200)
        .json({ data: await List.find({ language: data.language }) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

exports.listsController = new Lists();
