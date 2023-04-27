const mongoose=require("mongoose");

const orderSchema= new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.ObjectId,
      ref:"User",
      required:[true,"order must belong to user"]
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: "String",
      },
    ],
    taxPrice:{
      type:Number,
      default: 0
    },
   shippingPrice:{
      type:Number,
     default:0
   },
    totalOrderPrice:{
      type:Number
    },
    paymentMethodType:{
      type:String,
      enum:["cash","card"],
      default:"cash"
    },
    isPayed: {
      type:Boolean,
      default:false
    },
    paidAt:Date,
    isDelivered:{
      type:Boolean,
      default:false
    },
    deliveredAt:Date

  },{timestamps:true});

  orderSchema.pre(/^find/,function(next) {
    this.populate({path:"user",select:"name email phone profileImage "}).
    populate({path:"cartItems.product",select:"title imageCover"});
    next();
  });
  module.exports=mongoose.model("Order",orderSchema);