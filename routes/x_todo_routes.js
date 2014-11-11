
module.exports = function(app, mongoose){

//Load the model
var Todo = require('../models/todo')(mongoose);

app.get('/api/todos', function(req, res){

	Todo.find(function(err, todos){
	if(err)
		res.send(err);
	res.jsonp(todos);

	});

	//res.send('hello');

});


app.get('/api/todos/find/:todo_id', function(req, res){
	Todo.find({_id: req.params.todo_id},function(err, todos){
	if(err)
		res.send(err);
	res.jsonp(todos);

	});
});


app.post('/api/todos/new', function(req, res){
	Todo.create({text : req.body.text, done:false},
		function(err, todo){
			if(err)
				res.send(err);
			Todo.find(function(err, todos){
				if(err)
					res.send(err);
				res.jsonp(todos);
		});
	});
});



app.delete('/api/todos/delete/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});
}