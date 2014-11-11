
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
var url = require('url');
var xml = require('xml');
var app = express();


var mongoose = require('mongoose'); 					

mongoose.connect('mongodb://alalppnc007:27017/iss'); 	// connect to mongoDB database on modulus.io


app.configure(function(){
	app.use(express.static(__dirname + '/app'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
      
});

server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8888);
var appsocket;
io.sockets.on('connection', function(socket){
   console.log('IO Connect called'); 
  appsocket = socket;
  socket.on("new_activity", function(data){
      console.log('new_activity=> ' + data);
  });
  
  socket.on("update_activity_detail", function(data){
      console.log('update_activity_detail=> ' + data);
  });
});
//app.models = require('./models');  // a global object

//Compile models here and pass it to model routes that need them
var Activities = require('./models/activities')(mongoose);
 
//require('./routes/todo_routes')(app,mongoose);
require('./routes/activities_routes')(app,mongoose, io, xml, Activities);
require('./routes/users_routes')(app,mongoose, fs, url);
require('./routes/journals_routes')(app,mongoose, url);
require('./routes/products_routes')(app,mongoose, Activities);
require('./routes/models_routes')(app,mongoose);
require('./routes/resource_routes')(app,mongoose, fs, url);
require('./routes/dataservices_routes')(app,mongoose);


app.listen(8080);
console.log('App listening on port 8080');
