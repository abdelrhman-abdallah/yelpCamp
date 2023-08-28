if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const { Campground } = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

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
  for (let i = 0; i < 500; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: '64e5057c5c0eaf37dc1690f2',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[rand1000].longitude, cities[rand1000].latitude],
      },
      price: Math.floor(Math.random() * 100) + 10,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia sit voluptatem ea eaque sapiente quidem? Consectetur minus cupiditate eligendi! Perspiciatis dolores eaque quisquam dolorum at soluta atque nesciunt eos nam.',
      images: [
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693250819/YelpCamp/lsoujvor6cx7pwjzwvpx.jpg',
          filename: 'YelpCamp/lsoujvor6cx7pwjzwvpx',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693250833/YelpCamp/rq1oucdjd2xd26stl9lp.jpg',
          filename: 'YelpCamp/rq1oucdjd2xd26stl9lp',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693250852/YelpCamp/odqdbtxlb7milfzstgg6.jpg',
          filename: 'YelpCamp/odqdbtxlb7milfzstgg6',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693250862/YelpCamp/vupsrnteqribh9gogwdz.jpg',
          filename: 'YelpCamp/vupsrnteqribh9gogwdz',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693250878/YelpCamp/bt2tneonh5ooika4yru5.jpg',
          filename: 'YelpCamp/bt2tneonh5ooika4yru5',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
