const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./src/models/campground");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("MongoDD Connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  const camp = new Campground(campground);
  const newCampground = await camp.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { camp: campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { camp: campground });
});
app.put("/campgrounds/:id", async (req, res) => {
  const updatedCampground = await Campground.findByIdAndUpdate(
    { _id: req.params.id },
    req.body.campground,
    { new: true, runValidators: true }
  );
  res.redirect(`/campgrounds/${updatedCampground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.listen(3001, () => {
  console.log("Serving on Port 3001");
});
