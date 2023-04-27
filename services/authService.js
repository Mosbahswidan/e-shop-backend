const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const emailText = require("../utils/emailText");

// @desc signup
// @route GET api/v1/auth/signup
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
  //1- create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2- send jwt token
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "90d" }
  );
  res.status(201).json({ data: user, token });
});
// @desc signup
// @route GET api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  console.log(await bcrypt.compare(req.body.password, user.password));
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    // throw new Error("invalid email or password");
    // eslint-disable-next-line new-cap
    return next(new apiError("invalid email or password", 401));
  }
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "90d" }
  );
  res.status(200).json({ data: user, token });
});
// @desc protect route
exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token is valid
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    // eslint-disable-next-line new-cap
    return next(new apiError("you are not authorized please login ", 401));
  }
  //2- verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //3- check if user id is exist
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    // eslint-disable-next-line new-cap
    return next(new apiError("there is no user exist", 401));
  }
  //check if password change after token created
  if (user.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        // eslint-disable-next-line new-cap
        new apiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  req.user = user;
  next();
});
// @desc permission
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        // eslint-disable-next-line new-cap
        new apiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
// @desc fortget PASSWORD
// @route GET api/v1/auth/forgetPassword
// @access public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    // eslint-disable-next-line new-cap
    return next(new apiError("this email not exist", 404));
  }
  //2- generate reset code
  const resetCode = (Math.floor(Math.random() * 900000) + 100000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerfied = false;
  await user.save();
  // const msg = `Hi ${user.name}\n we recoverd a request to reset your account password\n your reset password is: ${resetCode} `;
  const msg = emailText({
    name: user.name,
    email: user.email,
    resetCode: resetCode,
  });
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message: msg,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerfied = undefined;
    await user.save();
    // eslint-disable-next-line new-cap
    return next(new apiError(`error in sending mail:${err}`, 500));
  }
  res.status(200).json({
    status: "success",
    message: "Success sending reset password to your email",
  });
});
// @desc verify reset code
// @route GET api/v1/auth/verifyResetCode
// @access public

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  //1- get user by his reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    // eslint-disable-next-line new-cap
    return next(new apiError("the email is invalid", 401));
  }
  if (!(user.passwordResetCode === hashedResetCode)) {
    // eslint-disable-next-line new-cap
    return next(new apiError("the reset code is incorrect", 401));
  }
  if (user.passwordResetExpires < Date.now()) {
    // eslint-disable-next-line new-cap
    return next(new apiError("the reset code is invalid", 401));
  }
  user.passwordResetVerfied = true;
  await user.save();
  res.status(200).json({
    status: "success",
    //message: "Success sending reset password to your email",
  });
});
// @desc verify reset password
// @route GET api/v1/auth/resetPassword
// @access public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    // eslint-disable-next-line new-cap
    return next(new apiError("there is no user exist for this email", 404));
  }
  if (!user.passwordResetVerfied) {
    // eslint-disable-next-line new-cap
    return next(new apiError("the reset password not verified", 400));
  }
  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerfied = undefined;
  await user.save();

  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "90d" }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});
