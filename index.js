const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const wishlistRouter = require("./routes/wishlist");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripe");
const { Order } = require("./model/Order");

const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

// TODO UPDATE ENDPOINT
//Webhooks
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINTSECRET;
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();

        break;
      case "payment_intent.created":
        const paymentIntentCreated = event.data.object;
        // Then define and call a function to handle the event payment_intent.created
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        // Then define and call a function to handle the event payment_intent.canceled
        break;
      case "payment_intent.processing":
        const paymentIntentProcessing = event.data.object;
        console.log("payment_intent.processing");
        // Then define and call a function to handle the event payment_intent.processing
        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case "payment_intent.requires_action":
        const paymentIntentRequiresAction = event.data.object;
        console.log("payment_intent.requires_action");
        // Then define and call a function to handle the event payment_intent.requires_action
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/customer_app/build")));
app.use("/admin", express.static(path.join(__dirname, "admin_app/build")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);

app.use("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin_app/build", "index.html"));
});

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "customer_app/build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
