const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category is unique"],
      minlength: [3, "to SHORT"],
      maxlength: [15, "to long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },

  { timestamps: true }
);
CategorySchema.post("save", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});
CategorySchema.post("init", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
