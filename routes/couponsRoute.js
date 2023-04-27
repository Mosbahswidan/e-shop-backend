const express = require("express");

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");
//mergeParams allow us to access params of another routes
const router = express.Router();
const authService = require("../services/authService");

router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin"), getCoupons)
  .post(
    authService.protect,
    authService.allowedTo("admin"),

    createCoupon
  );

router
  .route("/:id")
  .get(authService.protect, authService.allowedTo("admin"), getCoupon)
  .put(authService.protect, authService.allowedTo("admin"), updateCoupon)
  .delete(authService.protect, authService.allowedTo("admin"), deleteCoupon);

module.exports = router;
