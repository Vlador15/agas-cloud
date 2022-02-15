const bcrypt = require("bcrypt");
const Students = require("../models/Students");
const Feedbacks = require("../models/Feedbacks");
const { getDateReverse } = require("../utils/utils");
const fs = require("fs");

class Student {
  /**
   * [POST]
   * Создание аккаунта ученика
   * Creating a student account
   *
   * @param {object}
   * @returns {array}
   */

  async create(req, res) {
    try {
      let { data } = req.body;

      try {
        data = JSON.parse(data);
      } catch (e) {}

      let photo = [];
      if (req.file) photo = req.file.path;

      let birthday = Date.parse(data.birthday);
      let age =
        new Date(Date.now()).getFullYear() - new Date(birthday).getFullYear();

      let object = {
        uid: req.userId,
        fullName: data.fullName,
        photo: photo,
        sex: data.sex,
        phone: data.phone,
        email: data.email,
        birthday: data.birthday,
        age,
        education: data.education,
        cityOfResidence: data.cityOfResidence,
        citiesForLessons: data.citiesForLessons,
        contactInformation: data.contactInformation,
        aboutMe: data.aboutMe,
      };

      const candidate = await Students.findOne({ uid: object.uid });
      if (candidate)
        throw new Error("A student profile with this UID already exists"); // Профиль ученика с таким UID уже существует

      let student = await Students.create(object);

      return res.status(201).json({
        message: "You have successfully created an account",
        student,
      }); // Вы успешно создали аккаунт
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [PUT]
   * Обновление профиля ученика по uid
   * Updating a student's profile by uid
   *
   * @param {object}
   * @returns {array}
   */

  async update(req, res) {
    try {
      let { data } = req.body;

      try {
        data = JSON.parse(data);
      } catch (e) {}

      const candidate = await Students.findOne({ uid: req.userId });
      if (!candidate) throw new Error("There is no stunet with such a UID"); // Студента с таким UID не существует

      let photo = candidate.photo;
      if (req.file) {
        fs.unlink(`./${candidate.photo}`, (err) => {
          console.log("Deleted");
        });
        photo = req.file.path;
      }

      let birthday = Date.parse(data.birthday);
      let age =
        new Date(Date.now()).getFullYear() - new Date(birthday).getFullYear();

      let object = {
        uid: req.userId,
        fullName: data.fullName || candidate.fullName,
        photo: photo,
        sex: data.sex || candidate.sex,
        phone: data.phone || candidate.phone,
        email: data.email || candidate.email,
        birthday: data.birthday || candidate.birthday,
        age: age || candidate.age,
        cityOfResidence: data.cityOfResidence || candidate.cityOfResidence,
        citiesForLessons: data.citiesForLessons || candidate.citiesForLessons,
        contactInformation:
          data.contactInformation || candidate.contactInformation,
        education: data.education || candidate.education,
        aboutMe: data.aboutMe || candidate.aboutMe,
        updated: Date.now(),
      };

      let result = await Students.findOneAndUpdate(
        { uid: object.uid },
        {
          $set: { ...object },
        },
        {
          new: true,
        }
      );

      return res.status(201).json({
        message: "You have successfully updated the student profile", // Вы успешно обновили профиль ученика
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение данных о студента
   * Getting data about a student
   *
   * @param {string} uid - id аккаунта
   * @returns {array}
   */
  // prettier-ignore
  async getProfile(req, res) {
    try { 
      if (!req.userId) throw new Error("Auth error"); // Не указан параметр: uid

      const candidate = await Students.findOne({ uid: req.userId }).lean(); 
      if (!candidate)
        return res
          .status(404)
          .json({ message: "The student with this ID was not found" }); // Студент с таким ID не найден
  
        
      candidate.birthday = getDateReverse(candidate.birthday);  
  
      return res.status(200).json({ data: candidate });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение данных об аккаунте ученика
   * Getting data about a student's account
   *
   * @param {string} uid - id аккаунта
   * @returns {array}
   */
  async getBy(req, res) {
    try {
      let { uid } = req.params;
      if (!uid) throw new Error("Parameter not specified: uid"); // Не указан параметр: uid

      const candidate = await Students.findOne({ uid }).lean();

      if (!candidate)
        return res
          .status(404)
          .json({ message: "The student with this ID was not found" }); // Студент с таким ID не найден

      candidate.birthday = getDateReverse(candidate.birthday);

      return res.status(200).json({ data: candidate });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение всех студентов
   * Getting all students
   *
   * @returns {array}
   */
  async getAll(req, res) {
    const candidats = await Students.find({}).lean();

    let data = candidats.map(async (x) => {
      x.birthday = getDateReverse(x.birthday);
    });

    Promise.all(data).then(() => {
      return res.status(200).json({ data: candidats });
    });
  }

  /**
   * [GET] Добавление в бд новых полей в существующие аккаунты
   *
   * @returns {array}
   */
  async updateData(req, res) {
    const candidats = await Students.find({}, `uid`).lean();

    candidats.map(async (x) => {
      let acc = await Students.findOne({ uid: x.uid });

      acc.socketId = "";
      acc.save();
    });

    return res.json(candidats);
  }
}

exports.studentController = new Student();
