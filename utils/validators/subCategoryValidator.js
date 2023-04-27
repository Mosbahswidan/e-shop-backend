const slugify = require("slugify");
const { check,body } = require("express-validator");
const validator = require("../../mddlewares/validatorMiddleware");

exports.getSubCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid subCategory id format"),
    validator,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory is required")
    .isLength({ min: 2 })
    .withMessage("To short subCategory name ")
    .isLength({ max: 32 })
    .withMessage("To long subCategory name"),
  check("category").isMongoId().withMessage("Invalid subCategory id format"),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

exports.updateSubCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid subCategory id format"),
    body('name').custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    validator,
];
exports.deleteSubCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid subCategory id format"),
    validator,
];
