var express = require('express'),
  router = express.Router();
var amadeus = require('../amadeus.js')
var cloudant = require('../cloudant.js')

const MAX_NEAREST_AIRPORTS = 2;
const MAX_FLIES = 3;


// use https library for requests
const https = require("https");

router.post('/get-flight-offers', function(request, response) {

});


router.get('/suggestion/:id', function(request, response) {
  cloudant.getSugestion("0");
});

router.get('/recommendation/:longitude/:latitude', function(request, response) {
  var body = [];
  amadeus.referenceData.locations.airports.get({
    longitude: request.params.longitude,
    latitude: request.params.latitude
  }).then(function(response) {
    // console.log(response);
    var count = 0;
    response.data.forEach(function(element) {
      if (count < MAX_NEAREST_AIRPORTS) {
        count = count + 1;
        // console.log(element.iataCode);
        amadeus.shopping.flightDestinations.get({
          origin: element.iataCode
        }).then(function(response) {
          var cnt = 0
          response.data.forEach(function(elm) {
            if (cnt < MAX_FLIES) {
              console.log(elm);
              body = body + elm;
            }
          });
        }).catch(function(responseError) {
          console.log(responseError);
        });
      }
    });
  }).catch(function(responseError) {
    console.log(responseError.code);
  });
  console.log(body);
  response.send(body);
});

module.exports = router;
