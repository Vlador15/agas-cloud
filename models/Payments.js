const { Schema, model } = require("mongoose");

const Payments = new Schema({
  userId: { type: String }, // id покупателя
  email: { type: String }, // email покупателя
  paymentId: { type: String }, // id платежа
  custom_id: { type: String }, // custom_id
  title: { type: String }, // название товара
  description: { type: String }, // описание товара
  price: { type: String }, // цена
  currency: { type: String }, // валюта
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Payments", Payments);
