const express = require("express");

const { addToCart,getLoggedUserCart,deleteCartItem,clearAllCartItem,updateCartQuantity,applayCoupon } = require("../services/cartServices");
//mergeParams allow us to access params of another routes
const router = express.Router();
const authService = require("../services/authService");

router
  .route("/")
  .get(authService.protect, authService.allowedTo("user"),getLoggedUserCart)
  .post(authService.protect, authService.allowedTo("user"), addToCart)
  .delete(authService.protect, authService.allowedTo("user"),clearAllCartItem);
router.route("/applayCoupon")
  .put(authService.protect, authService.allowedTo("user"),applayCoupon);
router.route("/:id")
  .delete(authService.protect, authService.allowedTo("user"),deleteCartItem)
  .put(authService.protect, authService.allowedTo("user"),updateCartQuantity);


module.exports = router;
