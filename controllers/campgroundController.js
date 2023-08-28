const { Campground } = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  console.log(campgrounds[0].images);
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const files = req.files;
  const { campground } = req.body;
  const camp = new Campground(campground);
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = files.map((f) => {
    return { url: f.path, filename: f.filename };
  });
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
  const files = req.files;
  const { campground } = req.body;
  const updatedCampground = await Campground.findByIdAndUpdate(
    { _id: req.params.id },
    campground,
    { new: true, runValidators: true }
  );
  if (!updatedCampground) {
    req.flash('error', 'Error!!! Cannot Find This Campground');
    return res.redirect('/campgrounds');
  } else {
    const imgs = files.map((f) => {
      return { url: f.path, filename: f.filename };
    });
    updatedCampground.images.push(...imgs);
    if (req.body.deletedImages) {
      for (let filename of req.body.deletedImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await updatedCampground.updateOne({
        $pull: { images: { filename: { $in: req.body.deletedImages } } },
      });
    }
    await updatedCampground.save();
    req.flash('success', 'Successfully Updated the Campground');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  }
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash(
    'success',
    'Successfully Deleted a Campground and All Relevant Data'
  );
  res.redirect('/campgrounds');
};
