const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "the coupon name is required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "the coupon expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "the coupon discount required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
