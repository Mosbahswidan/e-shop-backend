const SubCategory = require("../models/subCategoryModel");
const factoryHandler = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc create a new subCategory
// @route POST api/v1/subcategories
// @access private
exports.createSubCategory = factoryHandler.createOne(SubCategory);

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};

  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
// @desc get all subcategories
// @route GET api/v1/subcategories
// @access public

exports.getSubCategories = factoryHandler.getAll(SubCategory);

// @desc get specific subcategory
// @route GET api/v1/subcategories/:id
// @access public

exports.getSubCategory = factoryHandler.getOne(SubCategory);
// @desc update sub category
// @route PUT api/v1/categories/:id
// @access private

exports.updateSubCategory = factoryHandler.updateOne(SubCategory);

// @desc delete sub category
// @route DELETE api/v1/subcategories/:id
// @access public

exports.deleteSubCategory = factoryHandler.deleteOne(SubCategory);
