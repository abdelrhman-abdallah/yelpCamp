const mongoose = require('mongoose');
const { Campground } = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected');
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: '64e5057c5c0eaf37dc1690f2',
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'http://source.unsplash.com/collection/483251',
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      price: Math.floor(Math.random() * 100) + 10,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia sit voluptatem ea eaque sapiente quidem? Consectetur minus cupiditate eligendi! Perspiciatis dolores eaque quisquam dolorum at soluta atque nesciunt eos nam.',
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
