const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator')
const errorHandlers = require('./config/errorHandlers');
const helpers = require('./helpers');
const app = express();
const path = require('path')

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Passport Config
require('./config/passport')(passport);
// require('./config/facebookAuth')(passport);


// Connect to MongoDB
mongoose
  .connect(
    process.env.DATABASE,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//models
require('./models/Department');
require('./models/Solution');
require('./models/Accessories');
require('./models/Roles');
require('./models/Request');

// EJS
// app.use(expressLayouts);
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));


// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Express body parser
// app.use(express.urlencoded({ extended: true }));

//validates all requests
app.use(expressValidator());

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.h = helpers;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (process.env.NODE_ENV === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
