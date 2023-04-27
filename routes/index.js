const categoryRoute = require("./categoryRouter");
const subCategoryRoute = require("./subCategoryRouter");
const brandsRouter = require("./brandRouter");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewsRoute = require("./reviewsRoute");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponsRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandsRouter);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoutes;
