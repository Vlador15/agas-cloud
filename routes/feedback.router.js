const Router = require("express");
const router = new Router();

// middleware
const auth = require("../middleware/auth.middleware");

// controllers
const { feedbackController } = require("../controllers/feedback.controller");

router.get("/feedbacks", feedbackController.getAll);
router.get("/feedback/:uid", feedbackController.getBy);
router.post("/feedback", auth, feedbackController.createFeedback);
router.delete("/feedback", feedbackController.deleteFeedback);
router.put("/feedback", feedbackController.updateFeedback);

module.exports = router;
