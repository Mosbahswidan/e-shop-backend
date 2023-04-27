/* eslint-disable import/order */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// eslint-disable-next-line import/no-extraneous-dependencies
const ReviewModel = require("../models/reviewsModel");
const factoryHandler = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};

  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};

// @desc get all reviews
// @route GET api/v1/reviews
// @access public

exports.getReviews = factoryHandler.getAll(ReviewModel);

// @desc get specific Review
// @route GET api/v1/reviews/:id
// @access public

exports.getReview = factoryHandler.getOne(ReviewModel);

// @desc create a new Review
// @route POST api/v1/reviews
// @access private/protect/user
exports.createReview = factoryHandler.createOne(ReviewModel);

// @desc update a Review
// @route POST api/v1/reviews
// @access private/protect/user

exports.updateReview = factoryHandler.updateOne(ReviewModel);

// @desc delete Review
// @route DELETE api/v1/reviews/:id
// @access private/protect/user-admin

exports.deleteReview = factoryHandler.deleteOne(ReviewModel);
