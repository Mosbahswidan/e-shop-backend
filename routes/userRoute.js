const express = require("express");
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator
} = require("../utils/validators/userValidator");
const {
  getUser,
  getUsersList,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData
} = require("../services/userService");
//mergeParams allow us to access params of another routes
const router = express.Router();
const authService = require("../services/authService");

 router.get("/getUserData",authService.protect,getLoggedUserData,getUser);
 router.put("/updateUserPassword",authService.protect,updateLoggedUserPassword);
 router.put("/updateUserData",authService.protect,updateLoggedUserValidator,updateLoggedUserData);
router.put("/changePassword/:id", changePasswordValidator, changeUserPassword);
router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin"), getUsersList)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
