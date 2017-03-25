// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session'); 
var configDB = require('./config/database.js');
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css",express.static(__dirname + "/css"));
app.use("/assets",express.static(__dirname + "/assets"));
app.use("/js",express.static(__dirname + "/js"));
app.use("/dist",express.static(__dirname + "/dist"));
app.use("/fonts",express.static(__dirname + "/fonts"));
app.use("/node_modules/react-notifications/lib",express.static(__dirname + "/node_modules/react-notifications/lib"));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'twofunctionsisherebabyafgotthepower' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
global.rootDir = path.resolve(__dirname);

// routes ======================================================================
require('./app/routes.js')(app, server, io); // load our routes and pass in our app

// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);
