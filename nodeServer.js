/**
 * Created by Dave on 10/26/16.
 */

//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
var express = require('express');

var app = express();
var port = 8080;
var host = 'localhost';

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));

//serve all files from the public directory
app.use(express.static(__dirname + '/public'));

var server = require('http').createServer(app);

//Use this app.get for serving up html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function(){
    console.log('Server listening on port %d', port);
});