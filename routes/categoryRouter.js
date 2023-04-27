const express = require("express");
// eslint-disable-next-line import/no-extraneous-dependencies

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadcategoryImage,
  resizeImage,
} = require("../services/categoryServices");

const authService = require("../services/authService");

//mergeParams allow us to access params of another routes
const router = express.Router();
const subCategories = require("./subCategoryRouter");
//nested route
router.use("/:categoryId/subcategories", subCategories);
router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadcategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadcategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
