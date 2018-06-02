'use strict';

const MongoClient = require("mongodb").MongoClient;

//connect the mongo db database

// Setting nothing in the options will assume no SSL
let options = {};

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
console.log(process.env.MONGODB_CERTIFICATE);
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
module.exports = addWord;

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

module.exports = getWords;
