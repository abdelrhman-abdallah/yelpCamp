const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Review } = require('./review');

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbNail').get(function () {
  return this.url?.replace('/upload', '/upload/w_200');
});
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  description: String,
  location: String,
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
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports.Campground = mongoose.model('Campground', CampgroundSchema);
