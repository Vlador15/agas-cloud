const { Schema, model, ObjectId } = require("mongoose");

const Students = new Schema({
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
  aboutMe: { type: String, required: true }, // обо мне
  citiesForLessons: [
    {
      type: String,
    },
  ], // города для преподавания
  photo: [String], // фото
  materials: { type: Array, default: [] }, // сохраненные материалы
  subjects: { type: Array, default: [] }, // сохраненные предметы
  courses: { type: Array, default: [] }, // сохраненные курсы
  teachers: { type: Array, default: [] }, // сохраненные преподаватели
  createdAt: { type: Date, default: Date.now }, // дата регистрации
  updatedAt: { type: Date, default: Date.now },

  testLessons: { type: Array, default: [] }, // запись на пробные уроки
  lessons: { type: Array, default: [] }, // запись на уроки

  socketId: { type: String }, // socketid
});

module.exports = model("Students", Students);
