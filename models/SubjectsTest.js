const { Schema, model } = require("mongoose");

const SubjectsTest = new Schema({
  teacherId: { type: String }, // ид преподавателя
  name: { type: String, required: true }, // название предмета,
  synonyms: { type: Array }, // синонимы к названию
  lessonLocation: [
    {
      type: String,
    },
  ], // место проведения урока
  price: { type: Number, required: true }, // цена за урок
  currency: { type: String, required: true }, // валюта
  comment: { type: String }, // комментарий к уроку
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Subjects_test", SubjectsTest);
