var socketio = require('socket.io');

// Dealing database calls in separate file.
var db = require('./chat-db');

// Define variabe io for local use in this file.
var io;

var users = []; // Online users array.
var connections = []; // Socket connections array.

// Define and export listen function with 'server' as argument, passed from server.js
exports.listen = function (server) {
	io = socketio.listen(server); // Establishing socket connection.
	io.set('log level', 2); // Logger configuration to minimum level.
	// Handle connection event when connection is established.
	io.sockets.on('connection', function (socket) {
		initializeConnection(socket);
		handleChoosingUsernames(socket);
		handleClientDisconnections(socket);
		handleMessageBroadcasting(socket);
	});
}

// Functions to be executed when connection is established.
function initializeConnection(socket) {
	// Calling Function to Load old messages history.
	showOldMsgs(socket);
	// Store socket connection in connections array.
	connections.push(socket);
	console.log('No. of sockets connected: %s', connections.length);
}

// Fetching 'getOldMsgs' function from 'chat-db.js' file using 'db' varaiable.
function showOldMsgs(socket) {
	db.getOldMsgs(6, function (err, results) {
		// Function emitting load old messages event to chat-server.js
		socket.emit('load old msgs', results);
	});
}

// Handle new users connections from client file: 'chat-ui.js'
function handleChoosingUsernames(socket) {
	// Handle new user event coming from client file: 'chat-ui.js'
	socket.on('new user', function (username, callback) {

		// Check validity of username.
		if (username === '') {
			callback('Enter a valid username.');
			return;
		} else if (users.indexOf(username) !== -1) {
			callback('Name already exists. Enter another username.');
			return;
		}

		// If valid username, call the calling function.
		callback(null);
		socket.username = username;
		// Store users logged in users array
		users.push(socket.username);
		// Update users array for each new user/socket connection.
		updateUsernames();
		// Function to send Status to clients.
		sendStatus({
			data: socket.username + ' is online',
			clear: true
		});
	});
}

// Function creating status event to display any kind of status in all clients: 'chat-ui.js' file.
function sendStatus(s) {
	io.sockets.emit('status', s);
}

// Function creating update users event to display online users list in all clients: 'chat-ui.js' file.
function updateUsernames() {
	io.sockets.emit('update users', users);
}

// Function handling send message event to retrieve and store chat information coming from clients: 'chat-ui.js' file.
function handleMessageBroadcasting(socket) {

	socket.on('send message', function (msg) {

		var data = msg.trim(); // Spaces trimmed in chat message.
		var time = Date(); // message created-date details.

		// Storing chat message in database via chat-db.js
		db.saveMsg({
			username: socket.username,
			msg: data,
			created: time
		}, function (err) {
			if (err) throw err
			// Function emitting new message event to display chat message in all clients: 'chat-ui.js' file.
			io.sockets.emit('new message', {
				username: socket.username,
				msg: data,
				created: time
			});
		});

		// Function sending status to display message sent in all clients: 'chat-ui.js' file.
		sendStatus({
			data: 'Message sent by ' + socket.username,
			clear: true
		});
	});

	// Function handling sending message event coming from chat-ui.js 
	socket.on('sending message', function (msg) {

		// Sending status to display message is being typed in all clients: 'chat-ui.js' file.
		sendStatus({
			data: socket.username + ' is typing ' + msg
		});
	});
}

// Function handling disconnect event to terminate connection coming from clients: 'chat-ui.js' file.
function handleClientDisconnections(socket) {

	// Function handling disconnect event coming from chat-ui.js
	socket.on('disconnect', function () {

		// Remove username associated to a particular in connections array.
		users.splice(users.indexOf(socket.username), 1);
		// Update users array after deleting user array upon disconnection.
		updateUsernames();
		// Remove socket connection from connections array.
		connections.splice(connections.indexOf(socket), 1);
		console.log('No. of sockets connected: %s', connections.length);
		//Function sending status to display user logging out in all clients: 'chat-ui.js' file.
		sendStatus({
			data: socket.username + ' user went away!!.'
		});
	});
}
