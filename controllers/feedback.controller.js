const Feedbacks = require("../models/Feedbacks");
const Teachers = require("../models/Teachers");
const Students = require("../models/Students");
const { getDate } = require("../utils/utils");
const mongoose = require("mongoose");

class Feedback {
  /**
   * [POST]
   * Добавление отзыва преподавателю
   * Adding a review to a teacher
   *
   * @param {object}
   * @returns {array}
   */

  async createFeedback(req, res) {
    try {
      let data = req.body;
      let object = {
        creatorId: req.userId,
        teacherId: data.teacherId,
        text: data.text,
        rating: data.rating,
        type: "teacher",
      };

      console.log(object);

      const creator = await Students.findOne({ uid: object.creatorId });
      const candidate = await Teachers.findOne({ uid: object.teacherId });
      if (!creator) throw new Error("There is no student with such a UID"); // Студента с таким UID не существует
      if (!candidate) throw new Error("There is no teacher with such a UID"); // Преподавателя с таким UID не существует
      if (object.creatorId === object.teacherId)
        throw new Error("You can't write yourself a review"); // Вы не можете написать сами себе отзыв

      object.fullName = creator.fullName;
      if (creator.photo[0]) {
        object.photo = creator.photo[0];
      } else {
        object.photo = "";
      }

      await Feedbacks.create(object);

      let feedbacks = await Feedbacks.find({
        teacherId: object.teacherId,
      }).lean();
      let averageRating =
        feedbacks.reduce((prev, current) => prev + current.rating, 0) /
        feedbacks.length;
      if (averageRating) {
        candidate.rating = averageRating.toFixed(1);
        candidate.save();
      }

      return res.status(201).json({
        message: "You have successfully added a feedback", // Вы успешно добавили отзыв
        data: object,
      });
    } catch (e) {
      console.log(e.message);
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [PUT]
   * Обновление анкеты преподавателя по uid преподавателя
   * Updating the teacher's questionnaire by the teacher's uid
   *
   * @param {object}
   * @returns {array}
   */

  async updateFeedback(req, res) {
    try {
      let { feedbackId, ...data } = req.body;
      if (!feedbackId) throw new Error("Parameter not specified: id"); // Не указан параметр: id
      if (!mongoose.Types.ObjectId.isValid(feedbackId))
        throw new Error("Invalid parameter: id"); // Некорректный параметр: id

      const feedback = await Feedbacks.findOne({ _id: feedbackId });
      if (!feedback) throw new Error("Feedback with this ID was not found"); // Отзыв с таким ID не найден

      let object = {
        creatorId: feedback.creatorId,
        teacherId: feedback.teacherId,
        text: data.text || feedback.text,
        rating: data.rating || feedback.rating,
        type: "teacher",
        updatedAt: new Date(),
      };

      let result = await Feedbacks.findOneAndUpdate(
        { _id: feedbackId },
        {
          $set: { ...object },
        },
        {
          new: true,
        }
      );

      let feedbacks = await Feedbacks.find({
        teacherId: object.teacherId,
      }).lean();
      let averageRating =
        feedbacks.reduce((prev, current) => prev + current.rating, 0) /
        feedbacks.length;

      if (averageRating) {
        candidate.rating = averageRating;
        candidate.save();
      }

      return res.status(201).json({
        message: "You have successfully updated the teacher's feedback", // Вы успешно обновили отзыв у преподавателя
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [DELETE]
   * Удаление отзывыв у преподавателя по id (отзыва)
   * Deleting teacher reviews by id (review)
   *
   * @param {object}
   * @returns {array}
   */

  async deleteFeedback(req, res) {
    try {
      let { id } = req.body;
      if (!id) throw new Error("Parameter not specified: id"); // Не указан параметр: id

      const feedback = await Feedbacks.findOne({ _id: id });
      if (!feedback) throw new Error("Feedback with this ID was not found"); // Отзыв с таким ID не найден

      await Feedbacks.deleteOne({ _id: id });

      let feedbacks = await Feedbacks.find({
        teacherId: object.teacherId,
      }).lean();
      let averageRating =
        feedbacks.reduce((prev, current) => prev + current.rating, 0) /
        feedbacks.length;

      if (averageRating) {
        candidate.rating = averageRating;
        candidate.save();
      }

      return res.status(201).json({
        message: "You have successfully deleted the feedback", // Вы успешно удалили отзыв
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение отзыва по id
   *
   * @param {string} id - id отзыва
   * @returns {array}
   */
  // async getBy(req, res) {
  //   try {
  //     let { id } = req.params;
  //     if (!id) throw new Error("Не указан параметр: id");
  //     if (!mongoose.Types.ObjectId.isValid(id))
  //       throw new Error("Некорректный параметр: id");
  //     const feedback = await Feedbacks.findOne({ _id: id });

  //     if (!feedback) throw new Error("Отзыв с таким ID не найден");

  //     // const teacherDto = new TeacherDto(candidate);
  //     return res.status(200).json({ data: feedback });
  //   } catch (e) {
  //     return res.status(400).json({
  //       message: e.message,
  //     });
  //   }
  // }

  /**
   * [GET]
   * Получение всех отзывов для преподавателя по uid
   * Getting all the feedback for the teacher by uid
   *
   * @param {string} uid - uid преподавателя
   * @returns {array}
   */
  async getBy(req, res) {
    try {
      let { uid } = req.params;
      if (!uid) throw new Error("Parameter not specified: uid"); // Параметр не указан: uid

      const feedbacks = await Feedbacks.find({ teacherId: uid });

      feedbacks.map((x) => {
        if (x) {
          x.createdAt = getDate(x.date);
          x.updatedAt = getDate(x.updatedAt);
          x.createdName = "Vlad Kucher"; // По uid в students получать ФИО и выводить
        }
      });

      return res.status(200).json({ data: feedbacks });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение всех отзывов
   * Getting all feedbacks
   *
   * @returns {array}
   */
  async getAll(req, res) {
    const feedbacks = await Feedbacks.find({}).lean();

    feedbacks.map((x) => {
      if (x) {
        x.createdAt = getDate(x.createdAt);
        x.updatedAt = getDate(x.updatedAt);
        x.createdName = "Vlad Kucher"; // По uid в students получать ФИО и выводить
      }
    });

    return res.status(200).json({ data: feedbacks });
  }
}

exports.feedbackController = new Feedback();
