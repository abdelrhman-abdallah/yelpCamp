const mongoose = require('mongoose');
const { schema } = require('./user');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports.Review = mongoose.model('Review', ReviewSchema);
