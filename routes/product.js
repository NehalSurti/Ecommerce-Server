const express = require("express");
const productController = require("../controller/product");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

router
  .get("/", productController.getAllProducts)
  .get("/find/:id", productController.getProduct)
  .patch("/:id", verifyTokenAndAdmin, productController.updateProduct)
  .delete("/:id", verifyTokenAndAdmin, productController.deleteProduct)
  .post("/", verifyTokenAndAdmin, productController.createProduct);

module.exports = router;
