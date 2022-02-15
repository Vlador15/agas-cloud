const Router = require("express");
const router = new Router();

// controllers
const { messagerController } = require("../controllers/messager.controller");

router.post("/messager/message", messagerController.addMessage);

module.exports = router;
