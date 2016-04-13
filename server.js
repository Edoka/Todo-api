var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos', middleware.requireAuthentication, function(req, res) {

	// var queryParams = req.query;
	// var filteredTodos = todos;
	//
	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// filteredTodos = _.where(filteredTodos, {
	// completed : true
	// });
	//
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// filteredTodos = _.where(filteredTodos, {
	// completed : false
	// });
	// }
	//
	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// filteredTodos = _.filter(filteredTodos, function(todo) {
	// return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// });
	// }
	//
	// res.json(filteredTodos);

	// ------Convert GET /todo to use sequelize
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like : '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where : where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});

});

//GET /todoes/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// id : todoId
	// });
	// if (matchedTodo) {
	// res.json(matchedTodo);
	// } else {
	// res.status(404).send();
	// }

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});

	// var matchedTodo;
	//
	// todos.forEach(function(todo) {
	// if(todoId === todo.id){
	// matchedTodo = todo;
	// }
	// });

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
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	// Assignment
	// call create on db.todo
	// respond with 200 and todo
	// res.status(400).json(e)

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

	// description : 'Take out trash',
	// //completed : false

	// body = _.pick(body, 'description', 'completed');
	//
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// return res.status(400).send();
	// }
	// body.description = body.description.trim();
	// body.id = todoNextId++;
	//
	// //todoNextId += 1;
	// todos.push(body);
	// res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	// var matchedTodo = _.findWhere(todos, {
	// id : todoId
	// });
	//
	// if (matchedTodo) {
	// todos = _.without(todos, matchedTodo);
	// res.json(matchedTodo);
	// } else {
	// res.status(404).send();
	// }

	//"Convert DELETE /todos/:id to sequelize"
	db.todo.destroy({
		where : {
			id : todoId
		}
	}).then(function(rowDeleted) {
		if (rowDeleted == 0) {
			res.status(404).json({
				error : 'No todo with id: ' + todoId + '!'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});

});

//PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};
	// // var matchedTodo = _.findWhere(todos, {
	// // id : todoId
	// // });
	// // if (!matchedTodo) {
	// // return res.status(404).send();
	// // }
	//
	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	// validAttributes.completed = body.completed;
	// } else if (body.hasOwnProperty('completed')) {
	// return res.status(400).send();
	// }
	//
	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length !== 0) {
	// validAttributes.description = body.description;
	// } else if (body.hasOwnProperty('description')) {
	// return res.status(400).send();
	// }
	//
	// _.extend(matchedTodo, validAttributes);
	// res.json(matchedTodo);

	//"Convert PUT /todos/:id to sequelize"

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).
			then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});

});

//POST  /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});

//POST  /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		
		if (token){
			res.header('Auth', token).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}
		
	}, function() {
		res.status(401).send();
	});


});




db.sequelize.sync({	
	force: true
	}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});

