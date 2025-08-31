var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/'); // block access if not logged in
  }
  
  res.render('summary', { title: 'Summary Page' });
});

module.exports = router;