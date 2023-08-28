const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Review } = require('./review');
const { options } = require('joi');

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbNail').get(function () {
  return this.url?.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports.Campground = mongoose.model('Campground', CampgroundSchema);
