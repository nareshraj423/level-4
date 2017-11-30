var mongoose = require('mongoose');

// Configuring MongoDB.
mongoose.connect('mongodb://localhost/chat', function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to MongoDB!');
	}
});

// Creating chat schema.
var chatSchema = mongoose.Schema({
	username: String,
	msg: String,
	created: {
		type: Date
	}
});

// Defining Chat model to retrieve data from mongodb.
var Chat = mongoose.model('chat', chatSchema);

// Function to find old messages from db and export results to chat-server.js
exports.getOldMsgs = function (limit, callback) {
	var query = Chat.find({});
	query.sort('-created').limit(limit).exec(function (err, results) {
		callback(err, results);
	});
};

// Creating save chat message function and exporting to chat-server.js
exports.saveMsg = function (data, callback) {
	var newMsg = new Chat({
		msg: data.msg,
		username: data.username,
		created: data.created
	});
	newMsg.save(function (err) {
		callback(err);
	});
};
