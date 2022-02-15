const Moderators = require("../models/Moderators");

class Moders {
  /**
   * [GET]
   * Получить информацию о модераторе
   * get information about the moderator
   *
   * @returns {array}
   */
  async getModerByToken(req, res) {
    try {
      if (!req.userId) throw new Error("Parameter not specified: 'userId'");

      const candidate = await Moderators.findOne({ userId: req.userId });
      if (!candidate) throw new Error("Moderator not found");

      res.status(200).json({ data: candidate });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [GET]
   * Получить список модераторов
   * Get moderators
   *
   * @returns {array}
   */
  async getModers(req, res) {
    try {
      // ПРОВЕРКА НА ADMIN ПО UID
      let moder = await Moderators.findOne({ userId: req.userId });
      if (!moder) throw new Error("You are not a moderator");
      if (moder.level < 1)
        throw new Error("This function is not available to you");

      const result = await Moderators.find({});
      res.status(200).json({ data: result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [POST]
   * Добавление модератора
   * Create moderator
   *
   * @returns {array}
   */
  async createModer(req, res) {
    try {
      // ПРОВЕРКА НА ADMIN ПО UID
      // let moder = await Moderators.findOne({ userId: req.userId });
      // if (!moder) throw new Error("You are not a moderator");
      // if (moder.level < 1)
      //   throw new Error("This function is not available to you");

      const { uid, level, fullName } = req.body;
      if (!uid) throw new Error("Parameter not specified: 'uid'");
      if (await Moderators.findOne({ userId: uid }))
        throw new Error("The moderator has already been created");

      const object = {
        userId: uid,
        level: level || 1,
        fullName: fullName ? fullName : `Moder-${uid}`,
      };
      let result = await Moderators.create(object);

      res.status(200).json({ result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  /**
   * [DELETE]
   * Удалить модератора
   * Delete moderator
   *
   * @returns {array}
   */
  async deleteModerById(req, res) {
    try {
      // ПРОВЕРКА НА ADMIN ПО UID
      let moder = await Moderators.findOne({ userId: req.userId });
      if (!moder) throw new Error("You are not a moderator");
      if (moder.level < 1)
        throw new Error("This function is not available to you");

      const { uid } = req.query;

      if (!uid) throw new Error("Parameter not specified: 'uid'");
      if (!(await Moderators.findOne({ userId: uid })))
        throw new Error("The moderator was not found");
      await Moderators.deleteOne({ userId: uid });

      res.status(200).json({ message: "Moderator deleted" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

exports.moderController = new Moders();
