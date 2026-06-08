const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');

const app = express();

const connectDB = require('./database');


app.set('view engine', 'html');
app.engine('html', hbs.__express);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('views', path.join(__dirname, '../views'));
hbs.registerPartials(path.join(__dirname, '../views/partials'));
hbs.registerHelper("eq", function(a, b) {
    return a === b;
});
app.use(express.static(path.join(__dirname, '../public')));


app.use(session({
  secret: 'Bhavya',
  resave: false,
  saveUninitialized: false,
}))

connectDB();

module.exports = app;