const express = require("express");
const cartController = require("../controller/cart");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");

router
  .post("/", verifyToken, cartController.addToCart)
  .get("/", verifyTokenAndAdmin, cartController.getAllCarts)
  .get("/find/:userId", verifyTokenAndAuthorization, cartController.getCart)
  .delete(
    "/:userId/products/:itemId",
    verifyTokenAndAuthorization,
    cartController.removeFromCart
  )
  .delete("/:userId", verifyTokenAndAuthorization, cartController.deleteCart)
  .patch(
    "/:userId/updateProductQuantity",
    verifyTokenAndAuthorization,
    cartController.updateProductQuantity
  );

module.exports = router;
