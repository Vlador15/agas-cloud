const { Schema, model } = require("mongoose");

const Products = new Schema({
  ru: {
    currency: { type: String, required: true },
    currency_text: { type: String, required: true },
    price: { type: String, required: true },
    title: { type: String, required: true }, // название товара
    time: { type: String, required: true }, // на сколько товар дается
    description: { type: String, required: true }, // описание товара
  },
  en: {
    currency: { type: String, required: true },
    currency_text: { type: String, required: true },
    price: { type: String, required: true },
    title: { type: String, required: true }, // название товара
    time: { type: String, required: true }, // на сколько товар дается
    description: { type: String, required: true }, // описание товара
  },
  he: {
    currency: { type: String, required: true },
    currency_text: { type: String, required: true },
    price: { type: String, required: true },
    title: { type: String, required: true }, // название товара
    time: { type: String, required: true }, // на сколько товар дается
    description: { type: String, required: true }, // описание товара
  },

  discountBool: { type: Boolean, default: false, required: true }, // есть ли скидка
  discount: { type: Number, required: true }, // сколько в % скидка
  days: { type: Number, required: true }, // на сколько товар дается в днях
  unix_time: { type: Number, required: true }, // на сколько товар дается в милисекундах
  id: { type: Number, required: true }, // id
});

module.exports = model("Products", Products);
