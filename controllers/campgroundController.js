const { Campground } = require('../models/campground');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const { campground } = req.body;
  const camp = new Campground(campground);
  camp.author = req.user._id;
  const newCampground = await camp.save();
  req.flash('success', 'Successfully Added a New Campground');
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Error!!! Cannot Find This Campground');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { camp: campground });
};

module.exports.editCampground = async (req, res) => {
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
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash(
    'success',
    'Successfully Deleted a Campground and All Relevant Data'
  );
  res.redirect('/campgrounds');
};
