const express = require("express");
const orderController = require("../controller/order");
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("../middleware/verifyToken");

router  
.post("/", verifyToken, orderController.createOrder)
.get("/", verifyTokenAndAdmin, orderController.getAllOrders)
.get("/find/:userId", verifyTokenAndAuthorization, orderController.getUserOrders)
.patch("/:id", verifyTokenAndAdmin, orderController.updateOrder)
.delete("/:id", verifyTokenAndAdmin,orderController.deleteOrder)
.get("/income/:id", verifyTokenAndAdmin, orderController.getMonthlyIncomeforProduct)
.get("/income", verifyTokenAndAdmin, orderController.getMonthlyIncome);

module.exports = router;