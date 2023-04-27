const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const couponModel=require("../models/couponMode");


const calculateTotalPrice=(cart)=>{
    let totalPrice=0;
    cart.cartItems.forEach((prod)=>{
      totalPrice += prod.price*prod.quantity;
    });
  cart.totalPrice=totalPrice;
  cart.totalPriceAfterDiscount=undefined;
    return totalPrice;
}

// @desc add to cart
// @route POST api/v1/cart
// @access protected/user
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  //1- get cart for logged user

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    //create cart for this user with product
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //calculate total cart price
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({status:"success",msg:"poduct added successfully",data:cart});
});
// @desc get logged user cart
// @route GET api/v1/cart
// @access protected/user

exports.getLoggedUserCart =asyncHandler(async(req,res,next)=>{
 
  const cart=await cartModel.findOne({user:req.user._id}).populate("cartItems.product");
   if(!cart){
    res.status(200).json({status:"success",data:[]});
   }
   res.status(200).json({status:"success",data:cart});

});

// @desc dlete cart item
// @route DELETE api/v1/cart/:id
// @access protected/user

exports.deleteCartItem=asyncHandler(async(req,res, next)=>{
const cart=await cartModel.findOneAndUpdate({user:req.user._id},{
  $pull:{cartItems:{_id:req.params.id}}
},{new:true});
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({status:"success",data:cart});

});

// @desc clear all cart item
// @route DELETE api/v1/cart
// @access protected/user
exports.clearAllCartItem=asyncHandler(async(req,res,next)=>{
await cartModel.findOneAndDelete({user:req.user._id});
  res.status(200).json({status:"success"});
});
// @desc update cart quantity
// @route PUT api/v1/cart/:id
// @access protected/user
exports.updateCartQuantity=asyncHandler(async(req,res,next)=>{
  const {quantity}=req.body;
 const cart=await  cartModel.findOne({user:req.user._id});
 if(!cart){
   // eslint-disable-next-line new-cap
   return(next(new apiError("there is no cart for this user",404)));
 }

 const itemIndex=cart.cartItems.findIndex(item=>item._id.toString()===req.params.id);
 if(itemIndex>-1){
 const item=cart.cartItems[itemIndex];
 item.quantity=quantity;
 cart.cartItems[itemIndex]=item;
 }else{
   // eslint-disable-next-line
   return(next(new apiError("this item not in your cart",404)));
 }

 calculateTotalPrice(cart);
  await cart.save();
  res.status(201).json({status:"success",data:cart});
});
// @desc applay coupon on cart
// @route PUT api/v1/cart/applayCoupon
// @access protected/user
exports.applayCoupon=asyncHandler(async(req,res,next)=>{
  //1- get coupon based on coupon model
  const coupon=await couponModel.findOne({name:req.body.coupon,expire:{$gt:Date.now()}});
  if(!coupon){
    return next(new apiError("theres no coupon name or coupon are expired",404));
  }
  //2- get logged user cart
  const cart=await cartModel.findOne({user:req.user._id});
  let totalPrice=calculateTotalPrice(cart);
  const totalPriceAfterDiscount=(totalPrice-(totalPrice*coupon.discount)/100).toFixed(2);
  cart.totalPriceAfterDiscount=totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({status:"success",data:cart});
});