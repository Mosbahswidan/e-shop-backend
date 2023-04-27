const slugify = require("slugify");
const { check,body } = require('express-validator');
const validator=require('../../mddlewares/validatorMiddleware');

exports.getBrandValidator=[
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    validator,
];

exports.createBrandValidator=[
 check("name").notEmpty().withMessage("Brand is required").
 isLength({min:3}).withMessage("To short Brand name ").
isLength({max:32}).withMessage("To long Brand name"),
body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
validator
];

exports.updateBrandValidator=[
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    validator,
];
exports.deleteBrandValidator=[
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    validator,
];