const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { Review } = require('../models/review');
const { Campground } = require('../models/campground');
const { reviewSchema } = require('../validationSchemas');

const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(',');
    console.log({ msg: 'review' });
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router.post(
  '/',
  validateReviewSchema,
  AsyncWrapper(async (req, res) => {
    const { review } = req.body;
    const newReview = new Review(review);
    const campground = await Campground.findById({
      _id: req.params.id,
    }).populate('reviews');
    campground.reviews.push(newReview);
    await newReview.save();
    const updatedCampground = await campground.save();
    req.flash('success', 'Success! Successfully Added a New Review');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

router.delete(
  '/:reviewId',
  AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    const review = await Review.findByIdAndDelete({ _id: reviewId });
    req.flash('success', 'Success! Successfully Deleted a Review');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
