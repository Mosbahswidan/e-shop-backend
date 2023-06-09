
const stripe=require("stripe")("sk_test_51N19MTJrpscm89imr4RRIJ4tRO51gJV7jbKOKHTIDgGDAfjctForXsGtAG0Ro75D27ODoLP6F7SdZMHMBVqM4xlz00QSH6v8ZW");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("./handlersFactory");
const orderModel = require("../models/orderModel");
const apiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel=require("../models/userModel")

const { updateOne } = require("./handlersFactory");


// @desc create cash order
// @route POST api/v1/orders/cartId
// @access private/user

exports.createCashOrder=asyncHandler(async(req,res,next)=>{
  //settings
  const taxPrice=0;
  const shippingPrice=0;
  //1 get cart depend on cart id
   const cart =await cartModel.findById(req.params.cartId);
   if(!cart){
     return next(new apiError("there is no cart with this cartId",404))
   }
  //2 get cart order price depend on cart price(check price after discount)
    const cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice;
   const totalOrderPrice=cartPrice+taxPrice+shippingPrice;

  //3 create order with default payment type
   const order=await orderModel.create({
    user:req.user._id,
    cartItems:cart.cartItems,
     taxPrice:taxPrice,
     shippingPrice:shippingPrice,
     totalOrderPrice:totalOrderPrice,

   });
  //4 decrement the quantity of product and increment the sold of product (after create order)
   if(order){
     const bulkOptions=cart.cartItems.map((item)=>({
       updateOne:{
         filter:{
           _id:item.product
         },
         update:{
           $inc:{quantity: -item.quantity,sold:+item.quantity}
         }
       }
     }));
     await  productModel.bulkWrite(bulkOptions,{});
   }
  // 5 clear cart
  await cartModel.findByIdAndDelete(req.params.cartId);
   res.status(201).json({status:"success",data:order});
});

exports.filterOrderForLoggedUser=asyncHandler(async(req,res,next)=>{
  if(req.user.role==="user")req.filterObject={user:req.user._id};
  next();
})

// @desc get all orders
// @route GET api/v1/orders
// @access private/admin-user

exports.getAllOrders=factoryHandler.getAll(orderModel);

// @desc get specific order
// @route GET api/v1/orders/:orderId
// @access private/admin-user

exports.getSpecificOrder=factoryHandler.getOne(orderModel);
// @desc update order status
// @route PUT api/v1/orders/:id/pay
// @access private/admin

exports.updateOrderToPaid=asyncHandler(async(req,res,next)=>{
  const order=await orderModel.findById(req.params.id);
  if(!order){
    return next(new apiError("there is no order for this id ",404));
  }
  order.isPayed=true;
  order.paidAt=Date.now();

  const updatedorder=await order.save();

  res.status(201).json({status:"true",data:updatedorder});
});
// @desc update order deliverd
// @route PUT api/v1/orders/:id/deliver
// @access private/admin

exports.updateOrderToDeliverd=asyncHandler(async(req,res,next)=>{
  const order=await orderModel.findById(req.params.id);
  if(!order){
    return next(new apiError("there is no order for this id ",404));
  }
  order.isDelivered=true;
  order.deliveredAt=Date.now();

  const updatedorder=await order.save();

  res.status(201).json({status:"true",data:updatedorder});
});
// @desc get checkout session from stripe and send it to response
// @route GET api/v1/orders/checkout-session/:cartId
// @access private/user

exports.getChecoutSession=asyncHandler(async(req,res,next)=>{
  //settings
  const taxPrice=0;
  const shippingPrice=0;
  //1 get cart depend on cart id
  const cart =await cartModel.findById(req.params.cartId);
  if(!cart){
    return next(new apiError("there is no cart with this cartId",404))
  }
  //2 get cart order price depend on cart price(check price after discount)
  const cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice;
  const totalOrderPrice=cartPrice+taxPrice+shippingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data:{
          currency:"ils",
          unit_amount:totalOrderPrice*100,
          product_data:{
            name:req.user.name
          }
        },
        quantity:1,
      }

    ],

    mode: 'payment',
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email:req.user.email,
    client_reference_id:req.params.cartId,

  });
  res.status(200).json({status:"success",session});

});

const createCardOrder=async(object)=>{
  const cartId=object.client_reference_id;
  const price=object.amount_total/100;
 const cart =await cartModel.findById(cartId);
 const user=await userModel.findOne({email:object.customer_email});
 //create order
 const order=await orderModel.create({
  user:user._id,
  cartItems:cart.cartItems,
   totalOrderPrice:price,
   isPayed:true,
   paidAt:Date.now(),
   paymentMethodType:"card",
 });
 if(order){
  const bulkOptions=cart.cartItems.map((item)=>({
    updateOne:{
      filter:{
        _id:item.product
      },
      update:{
        $inc:{quantity: -item.quantity,sold:+item.quantity}
      }
    }
  }));
  await  productModel.bulkWrite(bulkOptions,{});
  await cartModel.findByIdAndDelete(cartId);
}
};

exports.WebhookCheckout = asyncHandler(async(req,res,next)=>{
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_u4lG8RKBwSZ7PIjDQVTJveQFv0t2e1TP');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if(event.type==="checkout.session.completed"){
    createCardOrder(event.data.object);
  }
  res.status(200).json({recived:true});
});


/*
const session = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
line_items:
[
{ price_data:
{ currency: 'egp',
unit_amount: totalOrderPrice * 100,
product_data: { name: req.user.name,
}, },
quantity: 1, },
],
mode: 'payment',
success_url: `${req.protocol}://${req.get('host')}/orders`,
cancel_url: `${req.protocol}://${req.get('host')}/cart`, customer_email: req.user.email, client_reference_id: req.params.cartId, metadata: req.body.shippingAddress, });

 */