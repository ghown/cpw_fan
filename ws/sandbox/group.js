var express = require('express');

var router = express.Router();
module.exports = router;

router.post('/create', function(req, res) {
	console.log('create Group req.body:\n', req.body);
	var creatorUserId = req.body.user._id;
	var groupName = req.body.group.name;
	var group = {
		name: groupName,
		creatorUserId: creatorUserId
	};

	groups.insertAsync(group).then(function() {
		console.log('Inserted 1 object into the documents collection');
		console.log('finished.');
		res.json({
			status: 0,
			message: 'created'
		});
	}).catch(function(error) {
		var result = {
			message: 'Group not created',
			error: error
		};
		console.log('error.', error);
		if (error.code == 11000) {
			result.message = 'group name already exist';
		}
		res.statusCode = 403;
		res.json(result);
	});
});

router.post('/retrieve', function(req, res) {
	console.log('retrieve Group req.body:\n', req.body);
	var query = { creatorUserId: req.body.user._id };
	groups.find(query).toArray().then(function(result) {
		res.json(result);
	}).catch(function(error) {
		console.log('error.', error);
		res.statusCode = 500;
		res.json({
			message: 'db error',
			error: error
		});
	});
});
