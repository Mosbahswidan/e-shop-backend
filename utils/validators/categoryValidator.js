const slugify=require('slugify');
const { check ,body} = require('express-validator');
const validator=require('../../mddlewares/validatorMiddleware');

exports.getCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid category id format"),
    validator,
];

exports.createCategoryValidator=[
 check("name").notEmpty().withMessage("Category is required").
 isLength({min:3}).withMessage("To short category name ").
isLength({max:32}).withMessage("To long category name"),
body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
validator
];

exports.updateCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid category id format"),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    validator,
];
exports.deleteCategoryValidator=[
    check('id').isMongoId().withMessage("Invalid category id format"),
    validator,
];