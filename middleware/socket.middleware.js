const { messagerController } = require("../controllers/messager.controller");

const Students = require("../models/Students");
const Teachers = require("../models/Teachers");
const { getUid } = require("../utils/utils");

const getData = async (uid) => {
  let isTeacher = await Teachers.findOne({ uid }, "fullName");
  let isStudent = await Students.findOne({ uid }, "fullName");
  let data = {};

  if (isTeacher) {
    data = {
      uid,
      fullName: isTeacher.fullName,
      typeUser: "teacher",
    };
  } else if (isStudent) {
    data = {
      uid,
      fullName: isStudent.fullName,
      typeUser: "student",
    };
  }

  return data;
};

exports.socketMiddware = (io, app) => {
  // API
  app.post("/client/:id", (req, res) => {
    let users = [];
    ioLearning.sockets.sockets.forEach((item) => users.push(item.id));

    if (req.params.id) {
      io.to(users[1]).emit(
        "newMessage",
        `Message to client with id ${req.params.id}`
      );
      return res.status(200).json({
        message: `Message was sent to client with id ${req.params.id}`,
      });
    } else return res.status(404).json({ message: "Client not found" });
  });

  // SOCKET
  io.on("connect", async (socket) => {
    socket.on("socketAuth", async (data) => {
      try {
        let { token } = data;

        if (token) {
          const senderId = await getUid(token);
          if (senderId === undefined) throw new Error("senderId undefined");

          let user = await getData(senderId);
          let chatUser = await getData(data.chatId);

          socket.user = user;
          socket.uid = senderId;
          socket.chatId = data.chatId;
          socket.chatUser = chatUser;

          let messages = await messagerController.getMessage(socket);
          io.to(socket.id).emit("getMessages", {
            messages,
            fullName: socket.chatUser.fullName || "",
          });
        }
      } catch (e) {
        return console.log("[auth_error] " + e.message);
      }
    });

    socket.on("get_dialogs", async (data) => {
      try {
        let { token } = data;

        if (token) {
          const senderId = await getUid(token);
          if (senderId === undefined) throw new Error("senderId undefined");

          let user = await getData(senderId);
          socket.user = user;
          socket.uid = senderId;

          let dialogs = await messagerController.getDialogs(socket);
          let dialogsUsers = [];
          let result = dialogs.map(async (x) => {
            let info = await getData(x);
            dialogsUsers.push(info);
          });

          Promise.all(result).then(() => {
            io.to(socket.id).emit("getDialogs", {
              dialogs: dialogsUsers,
            });
          });
        }
      } catch (e) {
        console.log("[error_message] " + e.message);
      }
    });
  });
};
