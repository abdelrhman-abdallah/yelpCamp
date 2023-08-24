const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};
module.exports.registerUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.loginUser = (req, res) => {
  req.flash('success', `Welcome Back ${req.body.username}`);
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'GoodBye!!!');
    res.redirect('/campgrounds');
  });
};
