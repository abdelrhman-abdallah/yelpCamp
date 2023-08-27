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
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    let geom;
    const geoData = await geoCoder
      .forwardGeocode({
        query: `${cities[rand1000].city}, ${cities[rand1000].state}`,
        limit: 1,
      })
      .send();
    if (geoData) {
      geom = {
        type: 'Point',
        coordinates: geoData.body.features[0].geometry.coordinates,
      };
    } else {
      geom = {
        type: 'Point',
        coordinates: [31.235726, 30.044388],
      };
    }
    const camp = new Campground({
      author: '64e5057c5c0eaf37dc1690f2',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      geometry: geom,
      price: Math.floor(Math.random() * 100) + 10,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia sit voluptatem ea eaque sapiente quidem? Consectetur minus cupiditate eligendi! Perspiciatis dolores eaque quisquam dolorum at soluta atque nesciunt eos nam.',
      images: [
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693048849/YelpCamp/s5zr9n4f6cjuyfcuga2w.jpg',
          filename: 'YelpCamp/s5zr9n4f6cjuyfcuga2w',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693048856/YelpCamp/utjgbpyzznab6gna9cda.jpg',
          filename: 'YelpCamp/utjgbpyzznab6gna9cda',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693048870/YelpCamp/m3w2ctsgqk1jp3n1piie.jpg',
          filename: 'YelpCamp/m3w2ctsgqk1jp3n1piie',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693048882/YelpCamp/tmim1nnzcklqo2vpzoyc.jpg',
          filename: 'YelpCamp/tmim1nnzcklqo2vpzoyc',
        },
        {
          url: 'https://res.cloudinary.com/dav7stmnh/image/upload/v1693048892/YelpCamp/uxbns1hh6ywqfzsdmqry.jpg',
          filename: 'YelpCamp/uxbns1hh6ywqfzsdmqry',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
