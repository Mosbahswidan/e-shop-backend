/* eslint-disable import/order */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const UserModel = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const factoryHandler = require("./handlersFactory");
const { uploadSingleImage } = require("../mddlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const jwt = require("jsonwebtoken");
const { request } = require("express");
//upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");
//resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImage = fileName;
  }

  next();
});
// @desc get all users
// @route GET api/v1/users
// @access private

exports.getUsersList = factoryHandler.getAll(UserModel);

// @desc get specific user
// @route GET api/v1/users/:id
// @access private

exports.getUser = factoryHandler.getOne(UserModel);

// @desc create a new user
// @route POST api/v1/users
// @access private
exports.createUser = factoryHandler.createOne(UserModel);

// @desc update user
// @route PUT api/v1/users/:id
// @access private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      // eslint-disable-next-line new-cap
      new apiError(`No document for this id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      // eslint-disable-next-line new-cap
      new apiError(`No document for this id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

// @desc delete User
// @route DELETE api/v1/users/:id
// @access private

exports.deleteUser = factoryHandler.deleteOne(UserModel);

// @desc get logged user data
// @route DELETE api/v1/users/getUserData
// @access private/protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc update logged user password
// @route DELETE api/v1/users/updateUserPaassword
// @access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "90d" }
  );
  res.status(200).json({
    data: user,
    token,
  });
});
// @desc update logged user data
// @route DELETE api/v1/users/updateUserData
// @access private/protect

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({
    status:"success",
    data:updatedUser
  });
});
