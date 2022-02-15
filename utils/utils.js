const moment = require("moment");
const axios = require("axios");
require("dotenv").config();

exports.spaces = function (string) {
  if (!string) return false;
  if (typeof string !== "string") string = string.toString();
  return (
    string
      .split("")
      .reverse()
      .join("")
      .match(/[0-9]{1,3}/g)
      .join(" ")
      .split("")
      .reverse()
      .join("") + " руб."
  );
};

exports.getDate = function (date) {
  return `${moment(date).format("DD.MM.YYYY")}`;
};

exports.getDateReverse = function (date) {
  return `${moment(date).format("YYYY-MM-DD")}`;
};

exports.getFullDate = function (date) {
  return `${moment(date).format("DD.MM.YYYY HH:mm:ss")}`;
};

exports.date = function () {
  return `${moment(Date.now()).format("DD.MM.YYYY HH:mm:ss")}`;
};

exports.getUid = async (token) => {
  try {
    return "Удаленный фрагмент кода для безопасности";
  } catch (e) {
    console.log(e.message);
    return undefined;
  }
};
