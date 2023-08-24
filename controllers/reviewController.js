const { Campground } = require('../models/campground');
const { Review } = require('../models/review');

module.exports.createReview = async (req, res) => {
  const { review } = req.body;
  const newReview = new Review(review);
  newReview.author = req.user._id;
  const campground = await Campground.findById({
    _id: req.params.id,
  }).populate('reviews');
  campground.reviews.push(newReview);
  await newReview.save();
  const updatedCampground = await campground.save();
  req.flash('success', 'Success! Successfully Added a New Review');
  res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  const review = await Review.findByIdAndDelete({ _id: reviewId });
  req.flash('success', 'Success! Successfully Deleted a Review');
  res.redirect(`/campgrounds/${id}`);
};
