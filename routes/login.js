var express = require('express');
const querystring = require("querystring"); 
var router = express.Router();

var client_id = 'xxxxxxxxxxxx';
var redirect_uri = 'http://localhost:3000/callback';

router.get('/', function(req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-library-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));

    // TODO: the actual login jade template doesn't need to exist... or does it? it's not getting used
    // res.render('login');
    // console.debug("the request:", res);
});

module.exports = router;

function generateRandomString(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}