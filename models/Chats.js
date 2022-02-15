const { Schema, model } = require("mongoose");

const Chats = new Schema({
  userId: { type: String }, // uid собеседника
  creatorId: { type: String }, // uid отправителя (создателя чата)
  messages: [
    {
      senderId: { type: String }, // от кого смс
      message: { type: String }, // текст сообщения
      createdAt: { type: Date, default: Date.now },
      date: { type: String },
      fromMe: { type: Boolean }, //
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Chats", Chats);
