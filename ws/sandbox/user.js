var express = require('express');
var session = require('express-session');
var passport = require('passport');

passport.serializeUser(function(user, done) {
	console.log('user', user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log('deserializeUser user', id);
	users.findOne({_id: ObjectId(id)}).then(function(user) {
		console.log('findOne result', user);
		if (user == null) {
			done('pass', false);
		} else {
			console.log('User found.');
			done(null, user);
		}
	}).catch(function(error) {
		console.log('error.', error);
		done('pass', false);
	});
});

var router = express.Router();
module.exports = router;

var local = require('./users/local.js');
router.use('/local', local);

var google = require('./users/google.js');
router.use('/google', google);

var facebook = require('./users/facebook.js');
router.use('/facebook', facebook);

var linkedin = require('./users/linkedin.js');
router.use('/linkedin', linkedin);

var googleApi = require('./users/googleApi.js');
router.use('/googleApi', googleApi);

router.get('/getUser', function(req, res) {
	console.log('getUser');
	if (req.user) {
		res.json(req.user);
		return;
	}
	res.status(401).end();	
});

router.post('/signup', function(req, res) {
	console.log('signup req.body', req.body);
	var user = req.body;
	users.insertAsync(user).then(function(result) {
		console.log('Inserted 1 object into the users collection');
		console.log('User created.');
		req.session.user = user;
		res.json({});
	}).catch(function(error) {
		var result = {
			message: 'User not created',
			error: error
		};
		console.log('error.', error);
		if (error.code == 11000) {
			result.message = 'email already taken';
		}
		res.statusCode = 403;
		res.json(result);
	});
	
});

router.get('/logout', function(req, res) {
	console.log('logout');
	req.logout();
	res.json({});
});

var guid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
};

router.get('/getLoginToken', function(req, res) {
	console.log('getLoginToken');
	req.session.token = guid();
	res.json({token: req.session.token});
});

