// routes/product.route.js
const express = require("express");
const router = express.Router();
const uploadCloud = require("../middlewares/uploadCloud");
const validate = require("../middlewares/validate");
const { createProductSchema } = require("../validations/product.schema");
const {
    createProduct,
    deleteImage,
    updateProduct,
} = require("../controllers/product.controller");

router.post(
    "/",
    uploadCloud.single("image"),
    validate(createProductSchema),
    createProduct,
);

router.post("/gallery", uploadCloud.array("images", 5), uploadGallery);

router.delete("/image", validate(deleteImageSchema, "query"), deleteImage);

router.patch(
    "/:id",
    uploadCloud.single("image"),
    validate(updateProductSchema),
    updateProduct,
);

module.exports = router;
