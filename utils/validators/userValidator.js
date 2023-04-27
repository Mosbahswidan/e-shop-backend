const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const validator = require("../../mddlewares/validatorMiddleware");
const userModel = require("../../models/userModel");
const User = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User is required")
    .isLength({ min: 3 })
    .withMessage("To short User name ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          Promise.reject(new Error("Email is already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("invalid phone number"),
  check("profileImage").optional(),
  check("role").optional(),
  validator,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validator,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          Promise.reject(new Error("Email is already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("invalid phone number"),
  check("profileImage").optional(),
  check("role").optional(),
  validator,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validator,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("you must enter your confirmation password"),
  body("password")
    .notEmpty()
    .withMessage("you must enter the password")
    .custom(async (val, { req }) => {
      //1- validate the password is the really current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("invalid current password");
      }
      //2- verify password confirm
      if (val !== req.body.confirmPassword) {
        throw new Error("password not match confirm password");
      }
      return true;
    }),
  validator,
];
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .optional()
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          Promise.reject(new Error("Email is already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("invalid phone number"),
  validator,
];
