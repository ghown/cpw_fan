var express = require('express'); // charge ExpressJS
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var fs = require('fs');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var mongoose = require('mongoose');

var mongodb = require('mongodb');
var Promise = require('bluebird');

var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
global.ObjectId = mongodb.ObjectID;


Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

// var logDirectory = __dirname + '/log';
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);


// var accessLogStream = FileStreamRotator.getStream({
  // filename: logDirectory + '/access-%DATE%.log',
  // frequency: 'daily',
  // verbose: false
// });

global.cfg = require('./config.js');
var webservice = require('./ws/index.js');

var app = express();
app.use(function(req, res, next) {
	console.log('req.url', req.url);
	next();
});


//app.use(morgan('combined', {stream: accessLogStream}));

app.use(session({
	secret: 'cpw!4321!',
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({ url: global.cfg.mongodb.url })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// on gere les autres routes en informant le visiteur


app.post('/essai', function(req, res, next) {
	console.log('essai');
	res.json({
		status: 1,
		message: 'not created'
	});
});



app.use('/ws', webservice);

app.use(function(req, res, next) {
	var ua = req.get('User-Agent');
	var isMobile = /mobile/i.test(ua);
	if (isMobile) {
		express.static('build/app_mobile')(req, res, next);
		express.static('src/app_mobile')(req, res, next);
	} else {
		next();
	}
});
app.use(express.static('build/app'));
app.use(express.static('src/app'));
app.use(serveIndex('build/app', {'icons': true}));
app.use(serveIndex('src/app', {'icons': true}));

app.all('/sandbox/user/*', function(req, res) {
	res.sendFile('./app/sandbox/user/index.html', { root: __dirname });
});

app.all('/sandbox/group/*', function(req, res) {
	res.sendFile('./app/sandbox/group/index.html', { root: __dirname });
});

app.use(function(req, res, next) {
	console.log('404: Page not Found', req.url);
	next();
});

MongoClient.connect(cfg.mongodb.url + '?maxPoolSize=7', function(err, database) {
	if (err) {
		throw err;
	}

	global.db = database;
	global.users = db.collection('users');
	global.groups = db.collection('groups');
	//console.log('db', db);
	//console.log('db.s.topology.poolSize', db.s.topology.poolSize);

	app.listen(cfg.port, function() {
		console.log('server started on port ' + cfg.port);
	});
});

var options = {
	server: { poolSize: 6 }
}

// Connection to the database
// mongoose.connect(cfg.mongodb.url, options, function(err) {
	// if (err) {
		// throw err;
	// }
	// console.log('mongoose connection ok');
// });
