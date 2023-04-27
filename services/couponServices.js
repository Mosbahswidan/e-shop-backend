const couponModel = require("../models/couponMode");
const factoryHandler = require("./handlersFactory");


// @desc get all coupons
// @route GET api/v1/coupons
// @access private/admin

exports.getCoupons = factoryHandler.getAll(couponModel);

// @desc get specific coupon
// @route GET api/v1/coupons/:id
// @access private/admin

exports.getCoupon = factoryHandler.getOne(couponModel);

// @desc create a new coupon
// @route POST api/v1/coupons
// @access private/admin
exports.createCoupon = factoryHandler.createOne(couponModel);

// @desc update coupon
// @route PUT api/v1/coupons/:id
// @access private/admin

exports.updateCoupon = factoryHandler.updateOne(couponModel);

// @desc delete coupon
// @route DELETE api/v1/coupons/:id
// @access private/admin

exports.deleteCoupon = factoryHandler.deleteOne(couponModel);