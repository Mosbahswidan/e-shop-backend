const express = require("express");
const {
  addUserAddress,
  getLoggedUserAddresses,
  removeAddress,
} = require("../services/addressService");

const { addAdressValidator } = require("../utils/validators/addressValidator");

const router = express.Router();
const authService = require("../services/authService");

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addAdressValidator,
    addUserAddress
  )
  .get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedUserAddresses
  );
router.delete(
  "/:addressId",
  authService.protect,
  authService.allowedTo("user"),
  removeAddress
);

module.exports = router;
