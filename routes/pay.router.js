const Router = require("express");
const router = new Router();

// middleware
const auth = require("../middleware/auth.middleware");

// controllers
const { payController } = require("../controllers/pay.controller");

router.post("/payment/success", auth, payController.success);

module.exports = router;
