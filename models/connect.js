require("dotenv").config();
const mongoose = require("mongoose");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionMiddleware = session({
  secret: "spectra-dev",
  resave: true,
  saveUninitialized: true,
  maxAge: 1000 * 60 * 10, // 10 минут
  store: MongoStore.create({
    secret: "spectra-dev",
    mongoUrl: process.env.URL_DB,
    dbName: "sessions",
  }),
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 10, // 10 минут
  },
});

mongoose
  .connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected success"))
  .catch((e) => console.log("DB connect failed: " + e));

module.exports = {
  mongoose: mongoose,
  initSession: sessionMiddleware,
};
