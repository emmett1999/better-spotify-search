var express = require('express');
const querystring = require("querystring"); 
var router = express.Router();

var redirect_uri = 'http://localhost:3000/login';
const client_id = 'xxxxxxxxxxxxxxxx';
const client_secret = 'xxxxxxxxxxxxxxxx';

/* Get authorization token */
router.get('/authorize', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email user-library-read';

  const spotify_auth_uri = 'https://accounts.spotify.com/authorize?';
  console.log("Requesting Spotify auth token using URI: " + spotify_auth_uri);

  res.redirect(spotify_auth_uri +
      querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
  }));

});

function generateRandomString(length) {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/* Get access token */
router.get('/', function(req, res, next) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    console.log('Invalid state, will not request access token');
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    const spotify_access_uri = 'https://accounts.spotify.com/api/token';
    console.log('Requesting Spotify access token using: ' + spotify_access_uri);

    (async () => {
      const accessResult = await fetch(spotify_access_uri, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        body: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirect_uri
        })
      });

      const resultJson = await accessResult.json();
      console.log("Result JSON: ", resultJson);
    })();

    res.redirect('/');
  }
});

module.exports = router;
