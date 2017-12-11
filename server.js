var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    port = process.env.PORT || 8000,
    fs = require('fs'),
    https = require('https'),
    config = require('./config/database');
// ssl 
var passphrase = "this is optional";
var options = {
    key: fs.readFileSync('config/key.pem'),
    cert: fs.readFileSync('config/cert.crt')
};
if (passphrase) {
    options.passphrase = passphrase;
}
var mongoose = require('mongoose');




// Start Server
var server = https.createServer(options, app).listen(port, () => {
    console.log('We are live on https://localhost:' + port);
});
var io = require('socket.io').listen(server);



app.use(express.static('static'));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




// Import routes to be served
// require('./routes/api')(app);
require("./routes/auth")(app);
require("./routes/user")(app);
require("./routes/chat")(app);
require("./routes/msg")(app, io);
// routers(app);




// Database Setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gm');


// index
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

// 404
app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});
