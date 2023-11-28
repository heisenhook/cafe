const express = require('express');
const path = require('path');
const nocache = require('nocache');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const app = express();

// create cached instance of square-client during init
require('./util/square-client');

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger("dev"));
app.use(nocache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, ".well-known")));

app.use('/', routes);

// catch 404 and forward to error handler

/* printing an error causes error, too bad!
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        status: err.status,
        message: err.message,
        // If it is a response error then format the JSON string, if not output the error
        error: err.errors ? JSON.stringify(err.errors, null, 4) : err.stack
    });
});
*/
  
module.exports = app;