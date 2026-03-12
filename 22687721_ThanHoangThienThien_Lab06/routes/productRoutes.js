const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", productController.list);

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", upload.single("image"), productController.addProduct);

router.get("/search", productController.searchProduct);

router.get("/delete/:id", productController.deleteProduct);

router.get("/edit/:id", productController.showEditForm);

router.post(
  "/update/:id",
  upload.single("image"),
  productController.updateProduct,
);
module.exports = router;