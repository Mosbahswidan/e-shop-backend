const express = require("express");

const {
createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDeliverd,
  getChecoutSession
} = require("../services/oderServices");
//mergeParams allow us to access params of another routes
const router = express.Router();
const authService = require("../services/authService");

router
  .route("/:cartId")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    createCashOrder
  );
router.get("/",
  authService.protect,
  authService.allowedTo("user","admin"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get("/:id",
  authService.protect,
  authService.allowedTo("user","admin"),
  getSpecificOrder
);
router.put("/:id/pay",authService.protect,
  authService.allowedTo("admin"),updateOrderToPaid);
router.put("/:id/deliver",authService.protect,
  authService.allowedTo("admin"),updateOrderToDeliverd);
router.get("/checkout-session/:cartId",authService.protect,
  authService.allowedTo("user"),getChecoutSession);
module.exports = router;
