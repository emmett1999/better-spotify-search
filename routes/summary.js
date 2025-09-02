var express = require('express');
var router = express.Router();
const { getTopUserTracks } = require('../services/spotify/find_top_albums.js');

router.get('/', async function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/');
  }

  try {
    const tracks = await getTopUserTracks(req);
    res.render('summary', {
      tracks: tracks
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;