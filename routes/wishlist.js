const express = require("express");
const wishlistController = require("../controller/wishlist");
const router = express.Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router
  .post("/", wishlistController.addOrUpdateWishlist)
  .get("/:userId", wishlistController.getWishlist)
  .delete(
    "/:userId/products/:productId",
    wishlistController.deleteProductFromWishlist
  );

module.exports = router;
