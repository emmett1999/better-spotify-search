var express = require('express');
var router = express.Router();
const { getUserAlbums } = require('../services/spotify/find_top_albums.js');

/* GET top albums */
router.get("/", async function (req, res, next) {
  try {
    const albums = await getUserAlbums(req);
    res.json(albums);
  } catch (err) {
    next(err);
  }
});

module.exports = router;