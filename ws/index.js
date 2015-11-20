var express = require('express');
var hello = require('./hello.js');
var sandbox = require('./sandbox.js');
var router = express.Router();

router.use('/hello', hello);
router.use('/sandbox', sandbox);

router.get('/now', function(req, res) {
	res.json({now: new Date()});
});

module.exports = router;
