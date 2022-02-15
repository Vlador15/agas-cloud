const Router = require("express");
const router = new Router();

// controllers
const { authController } = require("../controllers/signup.controller");
const { validation, errorHandler } = require("../utils/validation");

router.post("/reg", [
  validation.email,
  validation.name,
  validation.password,
  validation.birthday,
  errorHandler,
  authController.reg,
]);

router.post("/login", [
  validation.email,
  validation.password,
  errorHandler,
  authController.login,
]);

router.post("/reset", [
  validation.password,
  errorHandler,
  authController.resetPassword,
]);

router.post("/check-email", [
  validation.email,
  errorHandler,
  authController.checkEmail,
]);

module.exports = router;
