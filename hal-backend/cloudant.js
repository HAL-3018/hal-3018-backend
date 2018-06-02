'use strict';

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

// Initialize the library with my account.
var cloudant = Cloudant({
  account: process.env.CLOUDANT_USER,
  password: process.env.CLOUDANT_PASSWORD
});


module.exports.getSugestion = function(id) {

  var db = cloudant.db.use('suggestion');

  var query = {
    "selector": {
      "user": "0"
    }
  };

  db.find(query, function(err, data) {
    console.log(data);
  });
};
