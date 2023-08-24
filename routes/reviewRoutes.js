const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utils/AsyncWrapper');
const reviewController = require('../controllers/reviewController');
const {
  validateReviewSchema,
  isLoggedIn,
  isReviewAuthor,
} = require('../middleware');

router.post(
  '/',
  isLoggedIn,
  validateReviewSchema,
  AsyncWrapper(reviewController.createReview)
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  AsyncWrapper(reviewController.deleteReview)
);

module.exports = router;
