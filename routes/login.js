var express = require('express');
const querystring = require("querystring"); 
var router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

/* Get authorization token */
router.get('/authorize', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email user-library-read user-top-read streaming user-read-playback-state user-modify-playback-state';

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
        req.session.token_timestamp = Date.now();

        // TODO: in the future, possibly redirect to /summary here
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    })();
  }
});

/* Explicit refresh endpoint */
// router.get('/refresh-token', async (req, res) => {
//   try {
//     if (!req.session.refresh_token) {
//       return res.status(401).json({ error: 'No refresh token in session' });
//     }

//     const newAccessToken = await refreshAccessToken(req);
//     res.json({ accessToken: newAccessToken });
//   } catch (err) {
//     console.error("Error refreshing token:", err);
//     res.status(500).json({ error: 'Failed to refresh token' });
//   }
// });

// helper function so both /player-token and /refresh-token can use it
async function refreshAccessToken(req) {
  const spotify_access_uri = 'https://accounts.spotify.com/api/token';
  const refreshResult = await fetch(spotify_access_uri, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: req.session.refresh_token
    })
  });

  const refreshJson = await refreshResult.json();
  console.log("Refreshed token:", refreshJson);

  if (refreshJson.error) {
    throw new Error(refreshJson.error_description || 'Failed to refresh token');
  }

  // update session with fresh token + timestamp
  req.session.access_token = refreshJson.access_token;
  req.session.expires_in = refreshJson.expires_in;
  req.session.token_timestamp = Date.now();

  return req.session.access_token;
}

/* Endpoint for Web Playback SDK to get a valid token */
router.get('/player-token', async (req, res) => {
  try {
    if (!req.session.access_token || !req.session.refresh_token) {
      return res.status(401).json({ error: 'Not authenticated with Spotify' });
    }

    const now = Date.now();
    const expiryTime = req.session.token_timestamp + (req.session.expires_in * 1000);

    if (now >= expiryTime) {
      console.log("Access token expired, refreshing...");
      const newAccessToken = await refreshAccessToken(req);
      return res.json({ accessToken: newAccessToken });
    }

    // still valid → just return it
    res.json({ accessToken: req.session.access_token });

  } catch (err) {
    console.error("Error getting player token:", err);
    res.status(500).json({ error: 'Failed to get player token' });
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