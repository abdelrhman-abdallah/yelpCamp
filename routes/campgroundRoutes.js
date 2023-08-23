const express = require('express');

const AsyncWrapper = require('../utils/AsyncWrapper');
const { Campground } = require('../models/campground');
const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require('../middleware');

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  AsyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
router.post(
  '/',
  isLoggedIn,
  validateCampgroundSchema,
  AsyncWrapper(async (req, res, next) => {
    const { campground } = req.body;
    const camp = new Campground(campground);
    camp.author = req.user._id;
    const newCampground = await camp.save();
    req.flash('success', 'Successfully Added a New Campground');
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

router.get(
  '/:id',
  AsyncWrapper(async (req, res) => {
    const campground = await Campground.findById({
      _id: req.params.id,
    })
      .populate({ path: 'reviews', populate: 'author' })
      .populate('author');
    if (!campground) {
      req.flash('error', 'Error!!! Cannot Find This Campground');
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp: campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  AsyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Error!!! Cannot Find This Campground');
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp: campground });
  })
);
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
  AsyncWrapper(async (req, res) => {
    const updatedCampground = await Campground.findByIdAndUpdate(
      { _id: req.params.id },
      req.body.campground,
      { new: true, runValidators: true }
    );
    if (!updatedCampground) {
      req.flash('error', 'Error!!! Cannot Find This Campground');
      return res.redirect('/campgrounds');
    }
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

router.delete(
  '/:id',
  isAuthor,
  isLoggedIn,
  AsyncWrapper(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash(
      'success',
      'Successfully Deleted a Campground and All Relevant Data'
    );
    res.redirect('/campgrounds');
  })
);

module.exports = router;
