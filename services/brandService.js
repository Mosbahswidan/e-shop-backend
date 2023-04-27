/* eslint-disable import/order */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const BrandModel = require("../models/brandModel");
const { v4: uuidv4 } = require("uuid");
const factoryHandler = require("./handlersFactory");
const {uploadSingleImage}=require("../mddlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");



//upload single image
exports.uploadBrandImage = uploadSingleImage('image');
//resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;
  next();
});
// @desc get all brands
// @route GET api/v1/brands
// @access public

exports.getBrands = factoryHandler.getAll(BrandModel);

// @desc get specific Brand
// @route GET api/v1/categories/:id
// @access public

exports.getBrand = factoryHandler.getOne(BrandModel);

// @desc create a new Brand
// @route POST api/v1/categories
// @access private
exports.createBrand = factoryHandler.createOne(BrandModel);

// @desc update Brand
// @route PUT api/v1/categories/:id
// @access private

exports.updateBrand = factoryHandler.updateOne(BrandModel);

// @desc delete Brand
// @route DELETE api/v1/categories/:id
// @access private

exports.deleteBrand = factoryHandler.deleteOne(BrandModel);
