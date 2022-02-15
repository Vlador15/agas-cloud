const { check } = require("express-validator");
const { validationResult } = require("express-validator");

exports.errorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorsObj = errors.errors?.map((x) => ({
    param: x.param,
    message: x.msg,
  }));

  if (!errors.isEmpty())
    return res.status(400).json({
      message: "Некорректный запрос",
      errorsObj,
    });
  next();
};

exports.validation = {
  email: check("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Некорректно указана почта"),

  name: check("name")
    .trim()
    .matches(/^[a-zA-Z0-9]{3,16}$/)
    .withMessage(
      "Имя должно быть больше 3 символов и не должно содержать символов"
    ),

  birthday: check("birthday")
    .trim()
    .isISO8601()
    .toDate()
    .withMessage(
      "Укажите день рождения в формате: год-месяц-день (YYYY-MM-DD)"
    ),

  password: check("password")
    .trim()
    .isLength({
      min: 5,
      max: 16,
    })
    .withMessage("Пароль должен иметь от 5 до 16 символов")
    .bail()
    // .matches(/(?=[A-Z])/)
    // .withMessage("В пароле должна быть минимум 1 заглавная буква")
    // .bail()
    // .matches(/(?=[0-9])/)
    // .withMessage("В пароле должны использоваться цифры")
    .not()
    .matches(/(?=[а-яА-Я])/)
    .withMessage("В пароле не должна использоваться киириллица"),
};
