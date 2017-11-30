$(function () {
	// Define DOM elements used in index.html.
	var socket = io.connect(),
		$messageForm = $('#messageForm'),
		$message = $('#message'),
		$messageArea = $('#messageArea'),
		$userForm = $('#userForm'),
		$userFormArea = $('#userFormArea'),
		$users = $('#users'),
		$username = $('#username'),
		$userDisplay = $('#userDisplay'),
		$chat = $('#chat'),
		$userError = $('#userError'),
		$msgStatus = $('#msgStatus'),
		$logOut = $('#logOut');


	var statusDefault = $msgStatus.text();

	// Function handling setting status coming from chat-server.js for brief period of time 
	function setStatus(s) {
		$msgStatus.text(s);

		if (s !== statusDefault) {
			var delay = setTimeout(function () {
				setStatus(statusDefault);
			}, 1000);
		}
	}

	// Function handling status event coming from chat-server.js 
	socket.on('status', function (s) {

		setStatus((typeof s === 'object') ? s.data : s);
		if (s.clear) {
			$message.val('');
		}
	});

	$userFormArea.submit(function (e) {
		e.preventDefault();
		var username = $username.val();
		// Function emitting new user event to chat-server.js
		socket.emit('new user', username, function (err) {
			if (err) {
				$userError.text(err);
				$username.val('');
			} else {
				$userFormArea.hide();
				$messageArea.show();
				$userDisplay.text('Welcome ' + username + ' !! to Socket IO Chat.');
			}
		});
	});

	// Function handling update users event coming from chat-server.js
	socket.on('update users', function (users) {
		displayUsers(users);
	});

	$messageForm.submit(function (e) {
		e.preventDefault();
		var msg = $message.val();
		// Function emitting send message event to 'chat-server.js' file.
		socket.emit('send message', msg);
	});

	$message.keydown(function (e) {
		var msg = '..';
		// Function emitting sending message event to 'chat-server.js' file.
		socket.emit('sending message', msg);
	});

	// Function handling new message event coming from chat-server.js
	socket.on('new message', function (data) {
		displayMsg(data.msg, data.username, data.created);
	});

	// Function handling load aold msgs event coming from chat-server.js
	socket.on('load old msgs', function (docs) {
		for (var i = docs.length - 1; i >= 0; i--) {
			displayMsg(docs[i].msg, docs[i].username, docs[i].created);
		}
	});

	function displayMsg(msg, username, created) {
		var html = '<div class="well"><strong>' + username + '</strong>:' + msg + '<br>' + created + '</div>';
		$chat.append(html);
	}

	function displayUsers(data) {
		var html = '';
		var i;
		for (i = 0; i < data.length; i++) {
			html += '<li class="list-group-item">' + data[i] + '</li>';
		}
		$users.html(html);
	}

	$logOut.submit(function (e) {
		// Function emitting disconnect event to 'chat-server.js' file.
		socket.emit('disconnect', function () {
			$userFormArea.show();
			$messageArea.hide();
		});
	});
});
