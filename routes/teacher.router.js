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
const { teacherController } = require("../controllers/teacher.controller");

router.get("/teachers", teacherController.getAll);
router.get("/teacher/:uid", teacherController.getBy);
router.get("/teacher-update", teacherController.updateData);

router.post("/teacher-filter", teacherController.filter);

router.get("/teacher", auth, teacherController.getProfile);
router.post("/teacher", auth, upload.single("photo"), teacherController.create);
router.put("/teacher", auth, upload.single("photo"), teacherController.update);

router.get("/test-subject/:uid", teacherController.getSubjectTestById);
router.get("/test-subject", auth, teacherController.getSubjectTestByToken);
router.delete("/test-subject/:id", teacherController.deleteTestSubject);
router.post("/test-subject-filter", teacherController.getSubjectTestFilter);
router.post("/test-subject", auth, teacherController.addSubjectTest);

module.exports = router;
