# YelpCamp

Welcome to YelpCamp, the final project of "The Web Developer Bootcamp 2023" course on Udemy! This project is designed to showcase the skills and knowledge you've gained throughout the course. YelpCamp is a web application that allows users to view and share information about campgrounds. It's built using various technologies and tools, and this README.md file will provide you with an overview of the project.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Deployment](#deployment)
- [Installation](#installation)
- [Usage](#usage)
- [Special Thanks](#special-thanks)
- [License](#license)

## Introduction

YelpCamp is a campground review website where users can:

- View a list of campgrounds.
- Create, edit, and delete their own campgrounds.
- Leave reviews and ratings for campgrounds.
- Register and log in securely.
- View campgrounds on a map and cluster map using Mapbox.
- Get real-time flash messages for a better user experience.
- And much more!

## Technologies Used

YelpCamp is built using a variety of technologies and libraries, including:

- [Express.js](https://expressjs.com/) for creating a server.
- [Express Session](https://www.npmjs.com/package/express-session) for session management.
- [Express Router](https://expressjs.com/en/4x/api.html#router) for routing.
- [MongoDB](https://www.mongodb.com/) as the database.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database hosting.
- [Mongoose](https://mongoosejs.com/) as the Object-Document Mapping (ODM) library.
- [Passport.js](http://www.passportjs.org/) for authentication and authorization.
- [Bootstrap](https://getbootstrap.com/) for styling.
- [Mapbox](https://www.mapbox.com/) for displaying maps and cluster maps.
- [Joi](https://joi.dev/) for server-side schema validation.
- HTML sanitization and [Helmet.js](https://helmetjs.github.io/) for security features.
- [EJS](https://ejs.co/) as the view engine.
- [Connect Flash](https://www.npmjs.com/package/connect-flash) for flash messages.

## Features

YelpCamp comes with several features to enhance the user experience:

- User authentication with secure password hashing.
- Authorization to ensure users can only edit/delete their own campgrounds and reviews.
- Dynamic campground and review creation and editing.
- Interactive maps to visualize campground locations.
- Server-side schema validation for data integrity.
- Security features to prevent common vulnerabilities.
- Flash messages for user feedback.

## Deployment

YelpCamp is deployed using [Render](https://render.com/), a cloud platform that simplifies deployment and scaling. You can access the live application [here](https://yelpcamp-cpuc.onrender.com).

## Installation

To run YelpCamp locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Set up a MongoDB database (local or using MongoDB Atlas) and update the database connection URL in the `.env` file.
4. Set up a Mapbox API key and update it in the `.env` file.
5. Start the application using `npm start`.

## Usage

- Visit the deployed application or run it locally.
- Sign up for an account or log in if you already have one.
- Explore the campgrounds, leave reviews, and create your own listings.
- Enjoy your camping adventures with YelpCamp!

## Special Thanks

A special thanks to Colt Steele, the instructor of "The Web Developer Bootcamp 2023" on Udemy. This project was created as the final assignment for the course, and your guidance and teachings have been invaluable in making it a reality.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Feel free to contribute, report issues, or provide feedback to help us improve YelpCamp! Happy camping!
