var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

//GET /todoes/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	// var matchedTodo;
// 	
	// todos.forEach(function(todo) {
		// if(todoId === todo.id){
			// matchedTodo = todo;
		// }
	// });
	
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
	// var i = 0;
	// //iterate over todos array. Find the match
	// //res.send('Asking for todo with id of ' + todos[i].id);
	 // while (i < todos.length ) {
	 	// if (todos[i].id === todoId) {
	 		// res.json(todos[i]);
	 		// //res.send('Asking for todo with id of ' + todoId);
	 	// } else if (i < todos.length) {
	 		// i++;
	 	// } else {
	 		// res.status(404).send('No Match Found ');
// 	 		
	 	// }
// 	 	
	 // }
	 

	
});

//POST  /todos
app.post('/todos', function(req, res) {
	var body = req.body;
	body = _.pick(body, 'description', 'completed');
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId++;
	
	//todoNextId += 1;
	todos.push(body);
	console.log(todos);
	res.json(body);
});


app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


