const Router = require("express");
const router = new Router();

// controllers
const { moderController } = require("../controllers/moder.controller");

// middleware
const auth = require("../middleware/auth.middleware");

router.get("/moders", auth, moderController.getModers);
router.get("/moder", auth, moderController.getModerByToken);
router.post("/moder", auth, moderController.createModer);
router.delete("/moder", auth, moderController.deleteModerById);

module.exports = router;
