const express = require("express");
const stripeController = require("../controller/stripe");
const router = express.Router();

router
//   .post("/payment", stripeController.stripePayment)
  .post("/create-payment-intent", stripeController.createPaymentIntent);

module.exports = router;
