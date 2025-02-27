const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true},
    img: { type: String, required: true},
    categories: { type: Array},
    size: { type: Array},
    color: { type: Array},
    price: { type: Number, required: true},
    inStock: {type: Boolean, default: true}
  },
  {
    timestamps: true,
  }
);

exports.Product = mongoose.models.Product
  ? mongoose.model("Product")
  : mongoose.model("Product", ProductSchema);
