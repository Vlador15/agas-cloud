const Teachers = require("../models/Teachers");
const Feedbacks = require("../models/Feedbacks");
const Subjects = require("../models/Subjects");
const SubjectsTest = require("../models/SubjectsTest");
const moment = require("moment");
const TeacherDto = require("../dtos/teacherDto");
const { getDateReverse } = require("../utils/utils");
const fs = require("fs");

class Teacher {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
  }

  /**
   * [POST]
   * Создание анкеты преподавателя
   * Creating a teacher questionnaire
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
        birthday: data.birthday,
        age,
        cityOfResidence: data.cityOfResidence,
        citiesForLessons: data.citiesForLessons,
        contactInformation: data.contactInformation,
        phone: data.phone,
        email: data.email,
        education: data.education,
        placeOfWork: data.placeOfWork,
        aboutMe: data.aboutMe,
        descriptionLesson: data.descriptionLesson,
        // subjects: data.subjects,
      };

      const candidate = await Teachers.findOne({ uid: object.uid });
      if (candidate)
        throw new Error(
          "The teacher's questionnaire with this UID has already been created"
        ); // Анкета преподавателя с таким UID уже создана

      await Teachers.create(object);
      await Subjects.deleteMany({ teacherId: object.uid });
      data.subjects.map((x) => {
        x.teacherId = object.uid;
        return x;
      });
      await Subjects.create(data.subjects || []);

      let teacher = await Teachers.findOne({ uid: object.uid }).lean();
      teacher.birthday = getDateReverse(teacher.birthday);
      teacher.subjects = data.subjects;

      return res.status(201).json({
        message: "You have successfully created a teacher profile",
        data: teacher,
      }); // Вы успешно создали анкету преподавателя
    } catch (e) {
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

  async update(req, res) {
    try {
      let { data } = req.body;

      try {
        data = JSON.parse(data);
      } catch (e) {}

      const candidate = await Teachers.findOne({ uid: req.userId });
      if (!candidate) throw new Error("There is no teacher with such a UID"); // Преподавателя с таким UID не существует

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
        birthday: data.birthday || candidate.birthday,
        age: age || candidate.age,
        cityOfResidence: data.cityOfResidence || candidate.cityOfResidence,
        citiesForLessons: data.citiesForLessons || candidate.citiesForLessons,
        contactInformation:
          data.contactInformation || candidate.contactInformation,
        phone: data.phone || candidate.phone,
        email: data.email || candidate.email,
        education: data.education || candidate.education,
        placeOfWork: data.placeOfWork || candidate.placeOfWork,
        aboutMe: data.aboutMe || candidate.aboutMe,
        descriptionLesson:
          data.descriptionLesson || candidate.descriptionLesson,
        // subjects: data.subjects || candidate.subjects,
        updatedAt: new Date(),
      };

      if (data.subjects) {
        data.subjects.map((x) => {
          x.teacherId = object.uid;
          return x;
        });

        await Subjects.deleteMany({ teacherId: req.userId });
        await Subjects.create(data.subjects);
      }

      let result = await Teachers.findOneAndUpdate(
        { uid: object.uid },
        {
          $set: { ...object },
        },
        {
          new: true,
        }
      );

      return res.status(201).json({
        message: "You have successfully updated the teacher's questionnaire", // Вы успешно обновили анкету преподавателя
        data: result,
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [POST]
   * Добавление предмета для преподавателя
   * Adding a subject for a teacher
   *
   * @param {object}
   * @returns {array}
   */

  async addSubject(req, res) {
    try {
      let data = req.body;
      data.uid = req.userId;
      if (!data.uid) throw new Error("UID not specified"); // UID не указан

      const candidate = await Teachers.findOne({ uid: data.uid });
      if (!candidate) throw new Error("There is no teacher with such a UID"); // Преподавателя с таким UID не существует

      candidate.subjects.push(...data.subjects);
      candidate.save();

      return res.status(201).json({
        message: "You have successfully added an item", // Вы успешно добавили предмет
        data: candidate.subject,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Not all parameters have been entered: " + e.message, // Не все параметры были введены:
      });
    }
  }

  /**
   * [POST]
   * Добавление пробного предмета для преподавателя
   * Adding a subjectTest for a teacher
   *
   * @param {object}
   * @returns {array}
   */

  async addSubjectTest(req, res) {
    try {
      let data = req.body;

      const subject = {
        teacherId: req.userId,
        name: data.name,
        categoryName: data.categoryName,
        lessonLocation: data.lessonLocation,
        price: data.price,
        currency: data.currency,
        comment: data.comment,
      };

      await SubjectsTest.create(subject);

      return res.status(201).json({
        message: "You have successfully added an item", // Предмет добавлен
        data: subject,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Not all parameters have been entered: " + e.message, // Не все параметры были введены:
      });
    }
  }

  /**
   * [DELETE]
   * Удаление пробного предмета у преподавателя по id
   * Deleting test-subject by id
   *
   * @param {object}
   * @returns {array}
   */

  async deleteTestSubject(req, res) {
    try {
      let { id } = req.params;
      if (!id) throw new Error("Parameter not specified: id"); // Не указан параметр: id

      const subject = await SubjectsTest.findOne({ _id: id });
      if (!subject) throw new Error("Test-subject with this ID was not found"); // Отзыв с таким ID не найден

      await SubjectsTest.deleteOne({ _id: id });

      return res.status(201).json({
        message: "You have successfully deleted the test-subject", // Вы успешно удалили пробный предмет
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [POST]
   * Получение тестовых уроков для преподаваля по фильтру
   * Get test subjects (filter)
   *
   * @param {object}
   * @returns {array}
   */
  // prettier-ignore
  async getSubjectTestFilter(req, res) {
    try {
      let data = req.body;
      let teacherFilter = {};
      let subjectsFilter = {};

      if (!data.subject) throw new Error("subject not specified"); // Предмет не указан
      if (data.subject) subjectsFilter["name"] = data.subject;
      if (data.citiesForLessons) teacherFilter["citiesForLessons"] = { $in: data.citiesForLessons, };

      let subjects = await SubjectsTest.find(subjectsFilter).collation({ locale: "en", strength: 2, });
      let uids = subjects.map((x) => x.teacherId);
  
      subjectsFilter["uid"] = { $in: uids, };
      let teachers = await Teachers.find(teacherFilter).collation({ locale: "en", strength: 2, }).lean();

      for (let teacher of teachers) {
        teacher.birthday = getDateReverse(teacher.birthday); 
        teacher.subjects = subjects.filter((z) => z.teacherId === teacher.uid);
        teacher.feedbacks = await Feedbacks.find({ teacherId: teacher.uid }); 
      }
      
      const shuffle = (array) => array.sort(() => Math.random() - 0.5);

      let result = teachers.filter((x) => x.subjects.length > 0); // получаем все анкеты
      shuffle(result); // перемешиваем
      let subscription = result.filter((z) => z.subscription.status === true); // получаем все платные подписки
      let othersSubscription = [
        ...result.filter((z) => z.subscription.status === false), 
        ...subscription.slice(5)
      ]; // получаем все бесплатные и оставшиеся платные
      shuffle(othersSubscription); // перемешиваем оставшиеся анкеты
      let list = [
        ...subscription.slice(0,5), 
        ...othersSubscription
      ]; // выводим 5 платных подписок в начале, а далее все оставшиеся

      return res.status(201).json({
        message: "List profiles", // Список профилей преподавателей
        data: list,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Not all parameters have been entered: " + e.message, // Не все параметры были введены:
      });
    }
  }

  /**
   * [GET]
   * Получение тестовых уроков для преподаваля по id
   * Adding a subjectTest for a teacher by id
   *
   * @param {object}
   * @returns {array}
   */

  async getSubjectTestById(req, res) {
    try {
      const { uid } = req.params;
      if (!uid) throw new Error("UID not specified"); // UID не указан
      let data = await SubjectsTest.find({ teacherId: uid });

      return res.status(201).json({
        message: "List items", // список предметов
        data,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Not all parameters have been entered: " + e.message, // Не все параметры были введены:
      });
    }
  }
  /**
   * [GET]
   * Получение тестовых уроков для преподаваля по токену
   * Adding a subjectTest for a teacher by token
   *
   * @param {object}
   * @returns {array}
   */

  async getSubjectTestByToken(req, res) {
    try {
      if (!req.userId) throw new Error("UID not specified"); // UID не указан
      let data = await SubjectsTest.find({ teacherId: req.userId });

      return res.status(201).json({
        message: "List items", // список предметов
        data,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Not all parameters have been entered: " + e.message, // Не все параметры были введены:
      });
    }
  }

  /**
   * [POST]
   * Фильтр по анкетам преподавателей
   * Filter by teacher profiles
   *
   * @param {object}
   * @returns {array}
   */
  // prettier-ignore
  async filter(req, res) {
    try { 
      // НАДО ПОЛУЧАТЬ ТОЛЬКО ТЕ ПОЛЯ, КОТОРЫЕ БУДУТ ИСПОЛЬЗОВАТЬСЯ В ВЫВОДЕ АНКЕТ ИЗ БД, лишние не получать
      let data = req.body; 

      let subjectsFilter = {};
      if (data.subject) subjectsFilter.name = data.subject;
      if (data.price) subjectsFilter.price = { 
        $gte: data.price.min, 
        $lte: data.price.max, 
      };
      if (data.lessonLocation) subjectsFilter.lessonLocation = { 
        $in: data.lessonLocation, 
      };  

      let teacherFilter = {};
      if (data.sex) teacherFilter.sex = data.sex;
      if (data.age) teacherFilter.age = {
          $gte: data.age.min,
          $lte: data.age.max,
      };
      if (data.rating) teacherFilter.rating = {
          $gte: data.rating,
      };
      if (data.citiesForLessons) teacherFilter.citiesForLessons = {
          $in: data.citiesForLessons,
      }; 

      let subjects = await Subjects.find(subjectsFilter).collation({
        locale: "en",
        strength: 2,
      });
 
      let teachers = await Teachers.find(teacherFilter).collation({
        locale: "en",
        strength: 2,
      }).lean();  
        
      const shuffle = (array) => array.sort(() => Math.random() - 0.5);

      for (let teacher of teachers) {
        teacher.birthday = getDateReverse(teacher.birthday); 
        teacher.subjects = subjects.filter((z) => z.teacherId === teacher.uid);
        teacher.feedbacks = await Feedbacks.find({ teacherId: teacher.uid }); 
      } 
  
      let result = teachers.filter((x) => x.subjects.length > 0); // получаем все анкеты
      shuffle(result); // перемешиваем
      let subscription = result.filter((z) => z.subscription.status === true); // получаем все платные подписки
      let othersSubscription = [
        ...result.filter((z) => z.subscription.status === false), 
        ...subscription.slice(5)
      ]; // получаем все бесплатные и оставшиеся платные
      shuffle(othersSubscription); // перемешиваем оставшиеся анкеты
      let list = [
        ...subscription.slice(0,5), 
        ...othersSubscription
      ]; // выводим 5 платных подписок в начале, а далее все оставшиеся

      return res.status(201).json({
        message: "List profiles", // Список профилей преподавателей
        data: list,
      }); 
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [POST]
   * Получить номер телефона преподавателя
   * Get the teacher's phone number
   *
   * @param {object}
   * @returns {array}
   */
  // prettier-ignore
  async getPhone(req, res) {
    try {
      let { teacherId } = req.body;
      if (!req.userId) throw new Error("Uid not specified"); // UID не указан
      if (!teacherId) throw new Error("teacherId not specified"); // UID не указан

      const teacher = await Teachers.findOne({ uid: teacherId });
      const student = await Teachers.findOne({ uid: req.userId });

      if (!teacher) throw new Error("There is no teacher with such a Uid"); // Преподавателя с таким UID не существует 
      if (!student) throw new Error("There is no student with such a Uid"); // Студента с таким UID не существует
 
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async checkTeacher(uid) {
    const candidate = await Teachers.findOne({ uid });

    if (candidate) {
      if (candidate.subscription.status) {
        let time = candidate.subscription.time - Date.now();
        if (time <= 0) {
          candidate.subscription.status = false;
          candidate.subscription.time = 0;
          candidate.subscription.viewsPhone = 0;
          candidate.subscription.feedbacks = 0;
        } else {
          candidate.subscription.timeText = moment(
            candidate.subscription.time
          ).format("YYYY.MM.DD");
        }
        candidate.save();
      }
    }
  }

  /**
   * [GET]
   * Получение данных о преподавателе
   * Getting data about a teacher
   *
   * @param {string} uid - id аккаунта
   * @returns {array}
   */
  // prettier-ignore
  async getProfile(req, res) {
    try { 
      if (!req.userId) throw new Error("Auth error"); // Не указан параметр: uid
 
      await this.checkTeacher(req.userId);

      const candidate = await Teachers.findOne({ uid: req.userId }).lean(); 
      if (!candidate)
        return res
          .status(404)
          .json({ message: "The teacher with this ID was not found" }); // Преподаватель с таким ID не найден
  
        
      candidate.birthday = getDateReverse(candidate.birthday); 
      candidate.feedbacks = await Feedbacks.find({ teacherId: req.userId });
      candidate.subjects = await Subjects.find({ teacherId: req.userId });
                
  
      return res.status(200).json({ data: candidate });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение данных о преподавателе
   * Getting data about a teacher
   *
   * @param {string} uid - id аккаунта
   * @returns {array}
   */
  // prettier-ignore
  async getBy(req, res) {
    try {
      let { uid } = req.params;
      if (!uid) throw new Error("Parameter not specified: uid"); // Не указан параметр: uid

      const candidate = await Teachers.findOne({ uid }).lean();
       
      if (!candidate)
        return res
          .status(404)
          .json({ message: "The teacher with this ID was not found" }); // Преподаватель с таким ID не найден

      candidate.birthday = getDateReverse(candidate.birthday); 
      candidate.feedbacks = await Feedbacks.find({ teacherId: uid });
      candidate.subjects = await Subjects.find({ teacherId: uid });
 
      return res.status(200).json({ data: candidate });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  /**
   * [GET]
   * Получение всех преподавателей
   * Getting all teachers
   *
   * @returns {array}
   */
  async getAll(req, res) {
    const candidats = await Teachers.find({}, `-courses`).lean();

    let data = candidats.map(async (x) => {
      x.birthday = getDateReverse(x.birthday);
      x.feedbacks = await Feedbacks.find({ teacherId: x.uid });
      x.subjects = await Subjects.find({ teacherId: x.uid });
    });

    Promise.all(data).then(() => {
      return res.status(200).json({ data: candidats });
    });
  }
}

exports.teacherController = new Teacher();
