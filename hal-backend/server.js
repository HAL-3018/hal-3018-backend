'use strict';

require('dotenv').config({silent: true});

var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')
var util = require('util')
var assert = require('assert');
var fs = require("fs");
var https = require('https');
var cloudant = require('./cloudant.js')
var conversation = require('./conversation.js')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

// define the routes to the controllers
var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

app.use('/api',require('./controllers'));

// Define router
var app = express.Router();
