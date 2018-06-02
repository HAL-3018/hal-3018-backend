'use strict';
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

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

module.exports = conversation;
