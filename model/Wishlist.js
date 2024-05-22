const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        title: { type: String },
        img: { type: String },
        price: { type: Number },
      },
    ],
    totalQuantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

WishlistSchema.index({ userId: 1, 'products.productId': 1 }, { unique: true, sparse: true });

exports.Wishlist = mongoose.models.Wishlist
  ? mongoose.model("Wishlist")
  : mongoose.model("Wishlist", WishlistSchema);
