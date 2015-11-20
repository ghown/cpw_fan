var readline = require('readline');
var google = require('googleapis');

var config = require('../config.js');

var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = config.oauth2GoogleClientApp.client_id;
var CLIENT_SECRET = config.oauth2GoogleClientApp.client_secret;
var REDIRECT_URL = config.oauth2GoogleClientApp.redirect_uris[0];

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/plus.me'
  });

  console.log('Visit the url: ');
  console.log(url);
  rl.question('Enter the code here:', function(code) {
	 console.log('code: |' + code + '|');
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
	  console.log('err: ', err);
	  console.log('tokens: ', tokens);
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
	console.log(profile);
    console.log(profile.displayName, ':', profile.tagline);
  });
});