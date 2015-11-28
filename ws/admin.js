var express = require('express');
var router = express.Router();

router.get('/resetDB', function(req, res) {
	console.log('resetDB');
	global.db.dropDatabase().then(function() {
		return users.createIndex({email: 1}, {unique: true});
	}).then(function(result) {
		console.log('Index created');
		res.json({});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			message: 'Database not setup',
			error: error
		});
	});
});


module.exports = router;
