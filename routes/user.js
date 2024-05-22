const express = require("express");
const userController = require("../controller/user");
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

router  
.get("/", verifyTokenAndAdmin, userController.getAllUsers)
.get("/find/:id", verifyTokenAndAdmin, userController.getUser)
.get("/stats", verifyTokenAndAdmin, userController.getUserStats)
.patch("/:id", verifyTokenAndAuthorization, userController.updateUser)
.delete("/:id", verifyTokenAndAuthorization,userController.deleteUser);

module.exports = router;