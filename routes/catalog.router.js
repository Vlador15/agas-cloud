const Router = require("express");
const router = new Router();

// controllers
const { catalogController } = require("../controllers/catalog.controller");

// middleware
const auth = require("../middleware/auth.middleware");

router.get("/products", catalogController.getProducts);
router.post("/products", auth, catalogController.addProduct);
router.put("/products", auth, catalogController.updateProduct);
router.delete("/products", auth, catalogController.deleteProductById);

router.get("/products-upload", catalogController.uploadJson);

module.exports = router;
