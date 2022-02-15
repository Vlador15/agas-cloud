const { Schema, model } = require("mongoose");

const Teachers = new Schema({
  uid: { type: String, required: true, unique: true }, // id
  fullName: { type: String, required: true }, // фио
  sex: { type: String, required: true }, // пол
  birthday: { type: Date, required: true }, // день рождения
  age: { type: Number, required: true }, // возраст
  cityOfResidence: {
    country: { type: String, required: true }, // страна проживания
    city: { type: String, required: true }, // город проживания
  },
  phone: { type: String, required: true }, // телефон
  email: { type: String, required: true }, // почта
  contactInformation: { type: String, required: true }, // контактная информация
  education: { type: String, required: true }, // образование
  placeOfWork: { type: String, required: true }, // место работы
  aboutMe: { type: String, required: true }, // о преподавателе
  descriptionLesson: { type: String, required: true }, // как проводится урок
  subscription: {
    status: { type: Boolean, default: false }, // выключена подписка
    time: { type: Number, default: 0 }, // преобретена на n времени (unix time)
    timeText: { type: String }, // преобретена на n времени
    viewsPhone: { type: Number, default: 3 }, // 3 демо-просмотра телефона учениками
    feedbacks: { type: Number, default: 0 }, // накрутка отзывов
    leads: { type: Array }, // массив для тех, кто просмотрел номер телефона
  }, // подписка для преподавателя
  citiesForLessons: [
    {
      type: String,
    },
  ], // города для преподавания
  photo: [String], // фото
  rating: { type: Number, default: 0 }, // кол-во звезд от 1 до 5
  subjects: { type: Array, default: [] },
  courses: { type: Array, default: [] }, // массив курсов
  createdAt: { type: Date, default: Date.now }, // дата регистрации
  updatedAt: { type: Date, default: Date.now },
  socketId: { type: String }, // socketid
});

module.exports = model("Teachers", Teachers);
