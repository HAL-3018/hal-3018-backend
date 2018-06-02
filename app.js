'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
// Then we'll pull in the database client library
const MongoClient = require("mongodb").MongoClient;
// Util is handy to have around, so thats why that's here.
const util = require('util')
// and so is assert
const assert = require('assert');
const fs = require("fs");
const https = require('https');
var Amadeus = require('amadeus');

var app = express();

app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

//connect conversation service

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1',
  headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});

//connect the mongo db database

// Setting nothing in the options will assume no SSL
let options = {};

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
let ca = [new Buffer(process.env.MONGODB_CERTIFICATE, 'base64')];

options = {
  ssl: true,
  sslValidate: true,
  sslCA: ca
};



let mongodb;

// console.log(options);
// This is the MongoDB connection. From the application environment, we got the
// credentials and the credentials contain a URI for the database. Here, we
// connect to that URI, and also pass a number of SSL settings to the
// call. Among those SSL settings is the SSL CA, into which we pass the array
// wrapped and now decoded ca_certificate_base64,
MongoClient.connect(process.env.MONGODB_URI, options, function(err, db) {
  // Here we handle the async response. This is a simple example and
  // we're not going to inject the database connection into the
  // middleware, just save it in a global variable, as long as there
  // isn't an error.
  if (err) {
    console.log(err);
  } else {
    // Although we have a connection, it's to the "admin" database
    // of MongoDB deployment. In this example, we want the
    // "examples" database so what we do here is create that
    // connection using the current connection.
    mongodb = db.db("examples");
    // console.log(db);
  }
});

// Add a word to the database
function addWord(word, definition) {
  return new Promise(function(resolve, reject) {
    mongodb.collection("words").insertOne({
        word: word,
        definition: definition
      },
      function(error, result) {
        if (error) {
          reject(error);
        } else {
          // console.log(result);
          resolve(result);
        }
      }
    );
  });
}

// Get words from the database
function getWords() {
  return new Promise(function(resolve, reject) {
    // we call on the connection to return us all the documents in the words collection.
    mongodb
      .collection("words")
      .find()
      .toArray(function(err, words) {
        if (err) {
          reject(err);
        } else {
          resolve(words);
        }
      });
  });
}

// The user has clicked submit to add a word and definition to the database
// Send the data to the addWord function and send a response if successful
app.put("/words", function(request, response) {
  addWord('request.body.word', 'request.body.definition')
    .then(function(resp) {
      response.send(resp);
    })
    .catch(function(err) {
      console.log(err);
      response.status(500).send(err);
    });
});

// Read from the database when the page is loaded or after a word is successfully added
// Use the getWords function to get a list of words and definitions from the database
app.get("/words", function(request, response) {
  getWords()
    .then(function(words) {
      response.send(words);
    })
    .catch(function(err) {
      console.log(err);
      response.status(500).send(err);
    });
});

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

amadeus.referenceData.urls.checkinLinks.get({
  airline: '1X'
}).then(function(response){
  console.log(response.body);   //=> The raw body
  console.log(response.result); //=> The fully parsed result
  console.log(response.data);   //=> The data attribute taken from the result
}).catch(function(error){
  console.log(error.response); //=> The response object with (un)parsed data
  console.log(error.response.request); //=> The details of the request made
  console.log(error.code); //=> A unique error code to identify the type of error
});

app.get('/', function(req, res) {
  res.send('Hello World!');
});


module.exports = app;
