/*Advance NodeJS Assignment
-------------------------------------------------------------------------------------------------------------------------------------------------
Problem statement:
1) Create a simple one-to-one chat application using socket.io. This chat application should also capture the events like “other user is typing”.
2) This chat application should also identify the user that it typing. It should have login and logout feature, with proper notification to other user who is in the chat. Something like “Aditya has logged out”, “Aditya has joined the chat etc” 
3) The chat should be real time and using socket, but for storing the chat history between two people. It should use mongodb. So, store the chat of users into mongodb (along with their username) , so that this can be retrived later by user by scrolling up. (just like facebook messenger)
Hint - use nodejs events to store the chat. Don’t disturb the usual flow of socket.io code by introduction mongoose save or any other mongoose function. Perform these database calls in a separate nodejs event. This is how realtime chat systems usually work.
-------------------------------------------------------------------------------------------------------------------------------------------------
Technologies to be used - NodeJs, ExpressJs and MongoDB, Socket.IO
-------------------------------------------------------------------------------------------------------------------------------------------------
Evaluation Basis:
This project will be evaluated on following basis -
1) Quality of JavaScript code - Your application's Javascript code should be optimized to be readable with proper indentation and comments. It should be broken down into functions for better maintainability and it should not contain any logical bugs.
2) Intuitive Thinking - You have thinking intuitively and make the user interface as easy to understand as possible. You have think about all the possible error cases and you have to handle them by giving proper response to user.
3) Originality of code - Your code will be checked for plagiarism and if it's not original, it will be discarded with a negative skill score.
-------------------------------------------------------------------------------------------------------------------------------------------------
Deliverables from Candidate
1) Compressed Folder containing all your code.
2) A text file containing the link of your github repository.
Create a folder containing all these deliverables. Compressed all these into a ZIP/RAR format
and then upload it in the assignment page.
-------------------------------------------------------------------------------------------------------------------------------------------------*/

var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app).listen('3000');

// Dealing socket.io code flow in separate file.
var chatServer = require('./src/lib/chat-server');
chatServer.listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/src/views/index.html');
});
