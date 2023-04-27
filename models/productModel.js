const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "The description is required"],
      minLength: [25, "Too short description"],
    },
    quantity: {
      type: Number,
      required: [true, "The quantity is requierd"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "The price is requierd"],
      max: [200000, "Too Long Price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "The image cover is requierd"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "The category is requierd"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAvearge: {
      type: Number,
      //12345
      min: [1, "the rating must be above or equal to 1"],
      max: [5, "the rating must be below or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true},
  }
);
productSchema.virtual("reviews",{
  ref:"Review",
  foreignField:"product",
  localField:"_id"
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

productSchema.post("init", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const  images=[];
   doc.images.forEach((img)=>{
    
    const imageUrl = `${process.env.BASE_URL}/products/${img}`;
    images.push(imageUrl);
   })
   doc.images=images;
  }
});
productSchema.post("save", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const  images=[];
   doc.images.forEach((img)=>{
    
    const imageUrl = `${process.env.BASE_URL}/products/${img}`;
    images.push(imageUrl);
   })
   doc.images=images;
  }
});

module.exports = mongoose.model("Product", productSchema);
