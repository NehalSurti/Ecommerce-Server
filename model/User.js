const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, max: 16, required: true, unique: true },
    fullName: {type: String},
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (value) {
          return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
            value
          );
        },
        message: "Not a valid Email Id",
      },
    },
    password: { type: String, minLength: 6, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default:
        "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif",
    },
    status: { type: String, default: "active" },
    transactions: { type: Number, default: 0 },
    address: { type: Object },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

exports.User = mongoose.models.User
  ? mongoose.model("User")
  : mongoose.model("User", UserSchema);
