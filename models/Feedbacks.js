const { Schema, model } = require("mongoose");

const Feedbacks = new Schema({
  creatorId: { type: String }, // ид ученика, оставившего отзыв
  teacherId: { type: String }, // ид преподавателя
  photo: { type: String }, // фото создателя
  text: { type: String }, // текст отзыва
  fullName: { type: String }, // имя оставившего отзыв
  rating: { type: Number }, // кол-во звезд от 1 до 5
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String }, // для кого отзыв
});

module.exports = model("Feedbacks", Feedbacks);
