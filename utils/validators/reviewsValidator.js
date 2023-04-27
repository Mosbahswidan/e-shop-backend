const slugify = require("slugify");
const { check, body } = require("express-validator");
const validator = require("../../mddlewares/validatorMiddleware");
const ReviewModel = require("../../models/reviewsModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validator,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("review ratings are required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid User id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product id format")
    .custom((val, { req }) =>
      ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("you already created a review before")
          );
        }
      })
    ),
  validator,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There is no review for this id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("your are not allowed to preform this action")
          );
        }
      
    })
    ),

  validator,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return ReviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("There is no review for this id"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("your are not allowed to preform this action")
            );
          }
        });
      }
      return true;
    }),
  validator,
];
