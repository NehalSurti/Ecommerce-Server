const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        img: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ userId: 1, "products.productId": 1 });

exports.Cart = mongoose.models.Cart
  ? mongoose.model("Cart")
  : mongoose.model("Cart", CartSchema);
