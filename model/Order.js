const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        title: { type: String },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        size: { type: String },
        color: { type: String },
        status: { type: String, default: "pending" },
        img: { type: String },
        totalPrice: { type: Number },
      },
    ],
    amounts: { type: Number, required: true },
    address: { type: Object, required: true },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
            value
          );
        },
        message: "Not a valid Email Id",
      },
    },
    phone: { type: String },
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  }
);

exports.Order = mongoose.models.Order
  ? mongoose.model("Order")
  : mongoose.model("Order", OrderSchema);
