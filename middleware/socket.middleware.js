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
   // delete
};
