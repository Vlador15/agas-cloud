const { Schema, model } = require("mongoose");

const Moderators = new Schema({
  userId: { type: String }, // uid пользователя
  fullName: { type: String }, // имя пользователя
  level: { type: Number, default: 1 }, // уровень роли (1 - модер, 2 - администратор)
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Moderators", Moderators);
