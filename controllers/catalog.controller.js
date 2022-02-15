const Products = require("../models/Products");
const Moderators = require("../models/Moderators");

class Catalog {
  /**
   * [POST]
   * Добавление продукта
   * Add product
   *
   * @returns {array}
   */
  async addProduct(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      let moder = await Moderators.findOne({ userId: req.userId });
      if (!moder) throw new Error("You are not a moderator");
      if (moder.level < 1)
        throw new Error("This function is not available to you");

      const data = req.body;
      if (await Products.findOne({ id: data.id }))
        throw new Error("A product with this id already exists");

      const product = {
        ru: data.ru,
        en: data.en,
        he: data.he,
        discountBool: data.discountBool || false,
        discount: data.discount || 0,
        days: data.days,
        unix_time: 1000 * 60 * 60 * 24 * Number(data.days),
        id: data.id,
      };
      console.log(product);
      let result = await Products.create(product);

      res.status(200).json({ result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получение товаров
   * Get products
   *
   * @returns {array}
   */
  async getProducts(req, res) {
    try {
      let data = await Products.find({});

      res.status(200).json({ data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [PUT]
   * Обновление продукта
   * Update product
   *
   * @returns {array}
   */
  async updateProduct(req, res) {
    try {
      // ПРОВЕРКА НА МОДЕРАТОРА ПО UID
      let moder = await Moderators.findOne({ userId: req.userId });
      if (!moder) throw new Error("You are not a moderator");
      if (moder.level < 1)
        throw new Error("This function is not available to you");

      const data = req.body;
      const product = await Products.findOne({ id: data.id });
      if (!product) throw new Error("A product with this ID does not exist");

      product.ru = data.ru;
      product.en = data.en;
      product.he = data.he;
      product.discountBool = data.discountBool || false;
      product.discount = data.discount || 0;
      product.days = data.days;
      product.unix_time = 1000 * 60 * 60 * 24 * Number(data.days);
      await product.save();

      res.status(200).json({ data: await Products.findOne({ id: data.id }) });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [DELETE]
   * Удалить проудукт
   * Delete product by ID
   *
   * @returns {array}
   */
  async deleteProductById(req, res) {
    try {
      // ПРОВЕРКА НА ADMIN ПО UID
      let moder = await Moderators.findOne({ userId: req.userId });
      if (!moder) throw new Error("You are not a moderator");
      if (moder.level < 1)
        throw new Error("This function is not available to you");

      const { id } = req.query;

      if (!id) throw new Error("Parameter not specified: 'id'");
      if (!(await Products.findOne({ id })))
        throw new Error("The product was not found");
      await Products.deleteOne({ id });

      res
        .status(200)
        .json({ message: "Product deleted", data: await Products.find({}) });
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
      let data = require("../data/products.json");

      if (data.length > 0) {
        for (let item of data) {
          // проверка наличия товара по id
          if (await Products.findOne({ id: item.id })) {
            console.log(
              `[Error] Product_id: "${item.id}" has already been created`
            );
          } else {
            let result = await Products.create(item);
            console.log(`Create product: [id: "${result.id}"]`);
          }
        }
      }

      res.status(200).json({ data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

exports.catalogController = new Catalog();
