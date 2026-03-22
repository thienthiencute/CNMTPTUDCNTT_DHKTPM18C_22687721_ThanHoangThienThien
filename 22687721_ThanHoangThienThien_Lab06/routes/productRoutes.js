const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.get("/", ctrl.index);

router.get("/create", ctrl.createForm);
router.post("/create", upload.single("image"), ctrl.create);

router.get("/:id", ctrl.detail);

router.get("/:id/edit", ctrl.editForm);
router.post("/:id/edit", upload.single("image"), ctrl.update);

router.get("/:id/delete", ctrl.delete);

module.exports = router;