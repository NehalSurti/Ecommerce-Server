const express = require("express");
const stripeController = require("../controller/stripe");
const router = express.Router();

router
  .post("/create-payment-intent", stripeController.createPaymentIntent)
  .post("/cancel-payment-intent", stripeController.cancelPaymentIntent)
  .post("/check-payment-status", stripeController.checkPaymentStatus);

module.exports = router;
