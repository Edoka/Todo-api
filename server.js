var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet wify for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'OFF to the Gym',
	completed: true	
}];


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
	var matchedTodo;
	
	todos.forEach(function(todo) {
		if(todoId === todo.id){
			matchedTodo = todo;
		}
	});
	
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

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


