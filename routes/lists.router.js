const Router = require("express");
const router = new Router();

// controllers
const { listsController } = require("../controllers/lists.controller");

router.get("/list/category", listsController.getCategory);
router.get("/list/subjects", listsController.getSubjects);
router.get("/list/themes", listsController.getThemes);
router.get("/list/subthemes", listsController.getSubThemes);

router.get("/list/university", listsController.getUniversity);
router.get("/list/faculties", listsController.getFaculties);

router.get("/list/subjects-upload", listsController.uploadJson);

router.get("/list", listsController.getItems);
router.post("/list", listsController.createItem);
router.put("/list", listsController.updateItemById);
router.delete("/list", listsController.deleteItemById);

module.exports = router;
