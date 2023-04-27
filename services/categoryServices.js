/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const factoryHandler = require("./handlersFactory");
const { uploadSingleImage } = require("../mddlewares/uploadImageMiddleware");

//upload single image
exports.uploadcategoryImage = uploadSingleImage("image");
//resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    req.body.image = fileName;
  }
  next();
});
// @desc get all categories
// @route GET api/v1/categories
// @access public

exports.getCategories = factoryHandler.getAll(CategoryModel);

// @desc get specific category
// @route GET api/v1/categories/:id
// @access public

exports.getCategory = factoryHandler.getOne(CategoryModel);

// @desc create a new category
// @route POST api/v1/categories
// @access private
exports.createCategory = factoryHandler.createOne(CategoryModel);

// @desc update category
// @route PUT api/v1/categories/:id
// @access private

exports.updateCategory = factoryHandler.updateOne(CategoryModel);

// @desc delete category
// @route DELETE api/v1/categories/:id
// @access private

exports.deleteCategory = factoryHandler.deleteOne(CategoryModel);
