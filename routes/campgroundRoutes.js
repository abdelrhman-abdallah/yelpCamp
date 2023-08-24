const express = require('express');

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
