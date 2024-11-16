var express = require('express');
const querystring = require("querystring"); 
var router = express.Router();

var redirect_uri = 'http://localhost:3000/callback';
const client_id = 'xxxxxxxxxxxx';
const client_secret = 'xxxxxxxxxxxx';

router.get('/', function(req, res, next) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  console.log("Found code: ", code);
  console.log("Found state: ", state);

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {

    (async () => {
      const accessResult = await fetch(`https://accounts.spotify.com/api/token`, {
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
});

module.exports = router;
