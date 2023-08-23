const { Campground } = require('./models/campground');
const { Review } = require('./models/review');
const { reviewSchema, campgroundSchema } = require('./validationSchemas');
const ExpressError = require('./utils/ExpressError');

module.exports.validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(',');
    console.log({ msg: 'review' });
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateCampgroundSchema = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(',');
    console.log(msg);
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You Have to Be Logged in');
    res.redirect('/login');
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', "You Don't Have Permission To Do That");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You Don't Have Permission To Do That");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
