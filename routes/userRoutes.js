const express = require('express');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const User = require('../src/models/user');
const { storeReturnTo } = require('../middleware');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});
router.post(
  '/register',
  AsyncWrapper(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const userInst = new User({ email, username });
      const registeredUser = await User.register(userInst, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', `Welcome to YelpCamp ${username}`);
        res.redirect('/campgrounds');
      });
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});
router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', `Welcome Back ${req.body.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'GoodBye!!!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
