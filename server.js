var express = require('express'); // charge ExpressJS
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');


var mongodb = require('mongodb');
var Promise = require('bluebird');

var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
global.ObjectId = mongodb.ObjectID;


Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

global.cfg = require('./config.js');
var webservice = require('./ws/index.js');

var app = express();

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
		express.static('app_mobile')(req, res, next);
	} else {
		next();
	}
});
app.use(express.static('app'));
app.use(serveIndex('app', {'icons': true}));

app.all('/sandbox/user/*', function(req, res) {
    res.sendFile('./app/sandbox/user/index.html', { root: __dirname });
});

app.use(function(req, res, next) {
	console.log('404: Page not Found', req.url);
	next();
});

MongoClient.connect(cfg.mongodb.url + '?maxPoolSize=5', function(err, database) {
	if (err) {
		throw err;
	}

	global.db = database;
	global.users = db.collection('users');
	//console.log('db', db);
	//console.log('db.s.topology.poolSize', db.s.topology.poolSize);

	app.listen(cfg.port, function() {
		console.log('server started on port ' + cfg.port);
	});
});



