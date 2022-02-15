const { Schema, model } = require("mongoose");

const Countries = new Schema({
  ru: { type: String, required: true, unique: true }, // страна на русском языке
  en: { type: String, required: true, unique: true }, // страна на английском языке
  he: { type: String, required: true, unique: true }, // страна на иврите

  cities: [
    {
      ru: { type: String, required: true, unique: true }, // город на русском языке
      en: { type: String, required: true, unique: true }, // город на английском языке
      he: { type: String, required: true, unique: true }, // город на иврите
    },
  ],
});

module.exports = model("Countries", Countries);
