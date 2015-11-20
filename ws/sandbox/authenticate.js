var express = require('express');
var passport = require('passport');

var router = express.Router();
module.exports = router;



router.post('/', passport.authenticate('local'), function(req, res) {
	console.log('authenticating...');
	res.json({user: req.user});
});

router.get('/check', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
	console.log('checking...');
	res.json({user: req.user});
});

router.get('/logout', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
	console.log('logout...');
	req.logout();
	res.json({});
});


