var express = require('express');
var router = express.Router();

router.get('/world', function(req, res) {
	res.json({content: 'hello world'});
});


module.exports = router;
