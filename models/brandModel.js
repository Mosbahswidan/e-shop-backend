const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand is unique"],
      minlength: [3, "to SHORT"],
      maxlength: [15, "to long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image:String,
  },
  { timestamps: true }
);

BrandSchema.post("save", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});
BrandSchema.post("init", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});
module.exports = mongoose.model("Brand", BrandSchema);


