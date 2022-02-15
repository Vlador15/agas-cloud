const { Schema, model } = require("mongoose");

const ListSubjects = new Schema({
  language: { type: String, required: true }, // на каком языке предмет
  name: { type: String, required: true }, // Имя справочника
  description: { type: String }, // описание справочника
  links: { type: Array, default: [] }, // связи
});

module.exports = model("List_subjects", ListSubjects);
