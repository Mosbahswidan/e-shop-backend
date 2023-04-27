const { check } = require("express-validator");
const validator = require("../../mddlewares/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.addAdressValidator = [
  check("details")
    .notEmpty()
    .withMessage("please we need more details about your place"),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("invalid phone number"),
    validator
];
