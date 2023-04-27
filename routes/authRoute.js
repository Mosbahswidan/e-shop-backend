const express = require("express");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const { signUp, login, forgetPassword,verifyResetCode,resetPassword } = require("../services/authService");
//mergeParams allow us to access params of another routes
const router = express.Router();
router
  .route("/signup")
  //.get(getUsersList)
  .post(signUpValidator, signUp);
router
  .route("/login")
  //.get(getUsersList)
  .post(loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").post(resetPassword);
// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
