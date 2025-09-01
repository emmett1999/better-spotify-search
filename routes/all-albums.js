var express = require('express');
var router = express.Router();
const { getUserAlbums } = require('../services/spotify/find_top_albums.js');

router.get('/', async function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/');
  }

  try {
    const albums = await getUserAlbums(req);
    res.render('all-albums', {
      albums: albums
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;