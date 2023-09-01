// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

const dbUrl =
  process.env.MongoDB_Production_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMateEngine = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const contentPolicy = require('./content-policy');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const reviewRouter = require('./routes/reviewRoutes');
const campgroundRouter = require('./routes/campgroundRoutes');
const userRouter = require('./routes/userRoutes');
const User = require('./models/user');

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((e) => {
    console.error.bind(console, 'Connection error:');
  });

const app = express();

app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...contentPolicy.connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...contentPolicy.scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...contentPolicy.styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dav7stmnh/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...contentPolicy.fontSrcUrls],
    },
  })
);

const secret = process.env.Secret || 'thisshouldbeasecret';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
  crypto: {
    secret,
  },
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  console.log(res.locals.success, res.locals.currentUser, res.locals.error);
  next();
});

app.use('/', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'Something Went Wrong' } = error;
  res.status(statusCode);
  res.render('error', { stack: error.stack, status: statusCode, msg: message });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Serving on Port ${port}`);
});
