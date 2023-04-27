const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

// @desc add product to wishlist
// @route POST api/v1/wishlist
// @access Protected/user

exports.addToWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    msg: "poduct added successfully to your wishList",
    data: user.wishList,
  });
});
// @desc remove product from wishlist
// @route DELETE api/v1/wishlist
// @access Protected/user
exports.removeFromWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    msg: "poduct removed successfully from your wishList",
    data: user.wishList,
  });
});
// @desc get Logged user wishlist
// @route GET api/v1/wishlist
// @access Protected/user
exports.getLoggedWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishList");

  res
    .status(200)
    .json({
      status: "success",
      result: user.wishList.length,
      data: user.wishList,
    });
});
