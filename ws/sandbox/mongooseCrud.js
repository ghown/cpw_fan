var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
module.exports = router;

// Create a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	age: Number
});

var User = mongoose.model('documents', userSchema);

router.post('/create', function(req, res) {
	var newUser = new User(req.body);
	newUser.save(function(err) {
		if (err) {
			throw err
			console.log('error.', error);
			res.json({
				status: 1,
				message: 'not retrieved',
				error: error
			});
		}
		console.log('Inserted 1 object into the documents collection');
		console.log('finished.');
		res.json({
			status: 0,
			message: 'created'
		});
	});
});

router.get('/retrieve', function(req, res) {
	console.log('about to retrieve.');
	console.log(req.query);
	var query = {};
	if (req.query.filter) {
		query.name = {$regex: new RegExp(req.query.filter)};
	}
	User.find(query, function(err, result) {
		if (err) {
			throw err;
			console.log('error.', error);
			res.json({
				status: 1,
				message: 'not retrieved',
				error: error
			});
		}
		myResult = result;
		console.log('found the following objects into the documents collection', result);
		console.log('finished.');
		res.json({
			status: 0,
			message: 'retrieved',
			result: myResult
		});
	});
});

router.post('/update', function(req, res) {

});

router.post('/delete', function(req, res) {

});

router.get('/drop', function(req, res) {

});
