var express = require('express');

var router = express.Router();
module.exports = router;

router.post('/createGroup', function(req, res) {
	console.log('createGroup req.body:\n', req.body);
	var ownerId = req.body.user._id;
	var name = req.body.group.name;
	var group = {
		name: name,
		ownerId: ownerId
	}
	groups.createIndexAsync({name: 1}, {unique: true}).then(function() {
		return groups.insertAsync(group);
	}).then(function() {
		// update owner groups field
		return users.update({_id: ObjectId(ownerId)}, {$push: {groups: name}});
	}).then(function() {
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
			result.message = 'group\'s name already taken';
		}
		res.statusCode = 403;
		res.json(result);
	});
});
