const express = require("express");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandsValidator");
const {
  addToWishList,
  removeFromWishList,
  getLoggedWishList,
} = require("../services/wishlistService");
//mergeParams allow us to access params of another routes
const router = express.Router();
const authService = require("../services/authService");

router
  .route("/")
  .post(authService.protect, authService.allowedTo("user"), addToWishList)
  .get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedWishList
  );
router.delete(
  "/:productId",
  authService.protect,
  authService.allowedTo("user"),
  removeFromWishList
);
// router
//   .route("/:id")
//   .get(getBrand)
//   .put(authService.protect, authService.allowedTo("admin"), updateBrand)
//   .delete(authService.protect, authService.allowedTo("admin"), deleteBrand);

module.exports = router;
