var express = require('express');
var router = express.Router();
const { getUserAlbums } = require('../testing-spotify-js/find_top_albums.js');

let cachedAlbums = [];

/* GET top albums */
router.get('/', async function(req, res, next) {
  try {
    if (cachedAlbums.length === 0) {
      cachedAlbums = await getUserAlbums();
    }
    res.json(cachedAlbums);
  } catch (err) {
    next(err);
  }
});

module.exports = router;