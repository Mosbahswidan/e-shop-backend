const express = require("express");
const {
 getReviewValidator,
 createReviewValidator,
 updateReviewValidator,
 deleteReviewValidator
} = require("../utils/validators/reviewsValidator");
const {
getReview,
getReviews,
createReview,
updateReview,
deleteReview,
createFilterObj,
setProductIdToBody
} = require("../services/reviewService");
//mergeParams allow us to access params of another routes
const router = express.Router({mergeParams:true});
const authService = require("../services/authService");

router
  .route("/")
  .get(createFilterObj,getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin','user'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
