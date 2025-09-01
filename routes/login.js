var express = require('express');
const querystring = require("querystring"); 
var router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

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
router.get('/', function(req, res) {
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
    console.log('Requesting Spotify access token using URI: ' + spotify_access_uri);

    // TODO: see if I need this async block here
    (async () => {

      try {
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
        if(process.env.NODE_ENV === 'development') {
          console.log("Result JSON: ", resultJson);
        }

        // store access credentials in session
        req.session.isAuthenticated = true;
        req.session.access_token = resultJson.access_token;
        req.session.refresh_token = resultJson.refresh_token;
        req.session.expires_in = resultJson.expires_in;

        // TODO: in the future, possibly redirect to /summary here
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    })();
  }
});

router.get('/status', (req, res) => {
  res.json({ isAuthenticated: !!req.session.isAuthenticated });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;