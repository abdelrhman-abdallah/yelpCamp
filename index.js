const express = require("express");
const app = express();
const path = require("path");
const ejsMateEngine = require("ejs-mate");
const methodOverride = require("method-override");
const { Campground } = require("./src/models/campground");
const { Review } = require("./src/models/review");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const ExpressError = require("./utils/ExpressError");
const AsyncWrapper = require("./utils/AsyncWrapper");
const { campgroundSchema, reviewSchema } = require("./validationSchemas");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("MongoDB Connected");
});

app.engine("ejs", ejsMateEngine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampgroundSchema = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    console.log(msg);
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    console.log({ msg: "review" });
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

app.get(
  "/campgrounds",
  AsyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampgroundSchema,
  AsyncWrapper(async (req, res, next) => {
    const { campground } = req.body;
    const camp = new Campground(campground);
    const newCampground = await camp.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  AsyncWrapper(async (req, res) => {
    const campground = await Campground.findById({
      _id: req.params.id,
    }).populate("reviews");
    res.render("campgrounds/show", { camp: campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  AsyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { camp: campground });
  })
);
app.put(
  "/campgrounds/:id",
  validateCampgroundSchema,
  AsyncWrapper(async (req, res) => {
    const updatedCampground = await Campground.findByIdAndUpdate(
      { _id: req.params.id },
      req.body.campground,
      { new: true, runValidators: true }
    );
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  AsyncWrapper(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/review",
  validateReviewSchema,
  AsyncWrapper(async (req, res) => {
    const { review } = req.body;
    const newReview = new Review(review);
    const campground = await Campground.findById({
      _id: req.params.id,
    }).populate("reviews");
    campground.reviews.push(newReview);
    await newReview.save();
    const updatedCampground = await campground.save();
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    const review = await Review.findByIdAndDelete({ _id: reviewId });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = error;
  res.status(statusCode);
  res.render("error", { status: statusCode, msg: message });
});

app.listen(3001, () => {
  console.log("Serving on Port 3001");
});
