'use strict';

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

// Initialize the library with my account.
var cloudant = Cloudant({account:process.env.CLOUDANT_USER, password:process.env.CLOUDANT_PASSWORD});

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});
