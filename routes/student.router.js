const Router = require("express");
const router = new Router();
const multer = require("multer");

const auth = require("../middleware/auth.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `./public/uploads/teachers`);
  },

  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage,
  limits: {
    fieldSize: 1024 * 1024 * 5, // 5mb
  },
  fileFilter: fileFilter,
});

// controllers
const { studentController } = require("../controllers/student.controller");

router.get("/students", studentController.getAll);
router.get("/student/:uid", studentController.getBy);
router.get("/student", auth, studentController.getProfile);
router.get("/student-update", studentController.updateData);

router.post("/student", auth, upload.single("photo"), studentController.create);
router.put("/student", auth, upload.single("photo"), studentController.update);

module.exports = router;
