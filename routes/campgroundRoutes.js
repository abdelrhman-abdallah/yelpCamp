const express = require('express');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const AsyncWrapper = require('../utils/AsyncWrapper');
const campgroundController = require('../controllers/campgroundController');
const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require('../middleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(AsyncWrapper(campgroundController.index))
  .post(
    isLoggedIn,
    upload.array('campground[images]', 10),
    validateCampgroundSchema,
    AsyncWrapper(campgroundController.createCampground)
  );

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router
  .route('/:id')
  .get(AsyncWrapper(campgroundController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('campground[images]', 10),
    validateCampgroundSchema,
    AsyncWrapper(campgroundController.editCampground)
  )
  .delete(
    isAuthor,
    isLoggedIn,
    AsyncWrapper(campgroundController.deleteCampground)
  );

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  AsyncWrapper(campgroundController.renderEditForm)
);

module.exports = router;
