function AsyncWrapper(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      return next(e);
    });
  };
}

module.exports = AsyncWrapper;
