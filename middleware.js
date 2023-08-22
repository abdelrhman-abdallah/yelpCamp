const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You Have to Be Logged in');
    res.redirect('/login');
  }
};

module.exports = isLoggedIn;
