const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/reset-password-request", authController.resetPasswordRequest)
  .post("/reset-password", authController.resetPassword)
  .get("/logout", authController.logout)
  .get(
    "/tokenVerify/:id",
    verifyTokenAndAuthorization,
    authController.tokenVerify
  )
  .get("/tokenVerify", verifyTokenAndAdmin, authController.tokenVerify)
  .get(
    "/tokenVerifyAndLogin",
    verifyTokenAndAdmin,
    authController.tokenVerifyAndLogin
  );

module.exports = router;
