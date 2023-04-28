/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const ProductModel = require("../models/productModel");
const factoryHandler = require("./handlersFactory");
const apiError = require("../utils/apiError");
const { uploadMixImages } = require("../mddlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const fileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${fileName}`);

    req.body.imageCover = fileName;
  }
  //image procssing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);

        req.body.images.push(fileName);
      })
    );
  }
  next();
});
// @desc get all products
// @route GET api/v1/products
// @access public

exports.getProducts = factoryHandler.getAll(ProductModel);

// @desc get specific product
// @route GET api/v1/products/:id
// @access public

exports.getProduct = factoryHandler.getOne(ProductModel, "reviews");

// @desc create a new product
// @route POST api/v1/products
// @access private
exports.createProduct = factoryHandler.createOne(ProductModel);

// @desc update product
// @route PUT api/v1/products/:id
// @access private

exports.updateProduct = factoryHandler.updateOne(ProductModel);

// @desc delete product
// @route DELETE api/v1/products/:id
// @access private

exports.deleteProduct = factoryHandler.deleteOne(ProductModel);
