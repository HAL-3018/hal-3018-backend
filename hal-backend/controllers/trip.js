var express = require('express'),
  router = express.Router();
var amadeus = require('../amadeus.js')

// use https library for requests
const https = require("https");

router.post('/get-flight-offers', function(request, response) {

});


router.get('/get-flight-offers', function(request, response) {
  amadeus.referenceData.urls.checkinLinks.get({
    airline: '1X'
  }).then(function(response) {
    console.log(response.data[0].href);
    //=> https://www.onex.com/manage/check-in
  }).catch(function(responseError) {
    console.log(responseError.code);
  });
});

module.exports = router;
