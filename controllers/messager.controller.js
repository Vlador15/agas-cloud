const Chats = require("../models/Chats");
const { getFullDate } = require("../utils/utils");

class Messages {
  /**
   * [POST]
   * Добавления сообщения
   * Add message
   *
   * @returns {array}
   */
  async addMessage(chat) {
    try {
      if (!chat) throw new Error("Field not specified: chat");
      if (!chat.userId || !chat.creatorId || !chat.message)
        throw new Error("Not all parameters are passed");

      let data = {
        userId: chat.userId,
        creatorId: chat.creatorId,
        messages: [{ ...chat.message }],
      };

      const isCreated = await Chats.findOne({
        $and: [
          {
            userId: {
              $in: [data.userId, data.creatorId],
            },
          },
          {
            creatorId: {
              $in: [data.userId, data.creatorId],
            },
          },
        ],
      });

      if (!isCreated) {
        return await Chats.create(data);
      } else {
        isCreated.messages.push({
          ...chat.message,
        });
        isCreated.save();
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
   * [POST]
   * Получение сообщений
   * Get messages
   *
   * @returns {array}
   */
  async getMessage(socket) {
    try {
      if (!socket) throw new Error("Field not specified: socket");

      let { chatId, uid } = socket;
      if (!chatId || !uid)
        throw new Error("Field not specified: chatId or uid");

      const chat = await Chats.findOne({
        $and: [
          {
            userId: {
              $in: [chatId, uid],
            },
          },
          {
            creatorId: {
              $in: [chatId, uid],
            },
          },
        ],
      });

      if (chat) {
        let messages = chat.messages.map((x) => {
          x.fromMe = x.senderId === uid ? true : false;
          x.date = getFullDate(x.createdAt);
          return x;
        });

        return messages;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
   * [POST]
   * Получение сообщений
   * Get messages
   *
   * @returns {array}
   */
  async getDialogs(socket) {
    try {
      if (!socket) throw new Error("Field not specified: socket");

      let { uid } = socket;
      if (!uid) throw new Error("Field not specified: uid");

      const chats = await Chats.find({
        $or: [
          {
            userId: {
              $in: [uid],
            },
          },
          {
            creatorId: {
              $in: [uid],
            },
          },
        ],
      });

      let chatsIds = chats
        .map((x) => {
          if (uid === x.userId && uid !== x.creatorId) return x.creatorId;
          if (uid === x.creatorId && uid !== x.userId) return x.userId;
          return false;
        })
        .filter((x) => !!x);

      return chatsIds;
    } catch (e) {
      console.log(e.message);
    }
  }
}

exports.messagerController = new Messages();
