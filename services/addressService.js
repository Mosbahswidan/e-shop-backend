const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

// @desc add address
// @route POST api/v1/address
// @access Protected/user

exports.addUserAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    msg: "address added successfully ",
    data: user.address,
  });
});
// @desc remove address
// @route DELETE api/v1/address
// @access Protected/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address:{_id:req.params.addressId} },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    msg: "address removed successfully",
    data: user.address,
  });
});
// @desc get Logged user addresses
// @route GET api/v1/address
// @access Protected/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("address");

  res.status(200).json({
    status: "success",
    result: user.address.length,
    data: user.address,
  });
});
