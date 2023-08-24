const express = require('express');
const passport = require('passport');
const AsyncWrapper = require('../utils/AsyncWrapper');
const userController = require('../controllers/userController');
const { storeReturnTo } = require('../middleware');

const router = express.Router();

router
  .route('/register')
  .get(userController.renderRegisterForm)
  .post(AsyncWrapper(userController.registerUser));

router
  .route('/login')
  .get(userController.renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    userController.loginUser
  );

router.get('/logout', userController.logoutUser);

module.exports = router;
