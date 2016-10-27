$(function () {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page

    // Prompt for setting a username
    var username;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();

    var socket = io();
    socket.connect('http://localhost')
    console.log("Connection to Cat socket server, ", socket)

    function addParticipantsMessage(data) {
        var message = '';
        if (data.numUsers === 1) {
            message += "You are alone :(";
        } else {
            message += "Yay !!!! you can send cats now :) ";
        }
        log(message);
    }

    // Sets the client's username
    function setUsername() {
        username = cleanInput($usernameInput.val().trim());

        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            var catAdded = {"username": username, "added": new Date().getTime()}
            console.log("Client emitting CatAddedEvent ", catAdded)
            socket.emit('CatAddedEvent', catAdded)
        }
    }

    function sendLove() {
        var message = $inputMessage.val();
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');

            var loveEvent = {from: socket.username, message: message, created: new Date().getTime()}
            console.log("client publishing LoveEvent", loveEvent)
            socket.emit('LoveEvent', loveEvent);

            addChatMessage({from: username, message: message});
        }
    }

    // Log a message
    function log(message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    function addChatMessage(event, options) {
        // Don't fade the message in if there is an 'X was typing'
        var $typingMessages = getTypingMessages(event);
        options = options || {};
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        console.log("Add chat message with name in color ", event)
        var $usernameDiv = $('<span class="username"/>')
            .text(event.from)
            .css('color', getUsernameColor(event.from));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(event.message);

        var typingClass = event.typing ? 'Typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', event.from)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addChatTyping(event) {
        data.typing = true
        data.message = 'is typing'
        addChatMessage(event)
    }

    function removeChatTyping(data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    function addMessageElement(el, options) {
        var $el = $(el);

        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    // Updates the typing event
    function updateTyping() {

        if (connected) {
            if (!typing) {
                typing = true;
                console.log("Client publishing TypingEvent for ", username)
                socket.emit('Typing');
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('StopTyping');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    // Gets the 'X is typing' messages of a user
    function getTypingMessages(event) {
        return $('.typing.message').filter(function (i) {
            return $(this).data('username') === event.from;
        });
    }

    // Gets the color of a username through our hash function
    function getUsernameColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendLove();
                socket.emit('StopTyping');
                typing = false;
            } else {
                setUsername();
            }
        }
    });

    $inputMessage.on('input', function () {
        updateTyping();
    });

    // Click events
    $loginPage.click(function () {
        $currentInput.focus();
    });

    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    // Socket events
    socket.on('LoggedInEvent', function (event) {
        connected = true;
        var message = "Let's Cat -_-"
        log(message, {prepend: true});
        addParticipantsMessage(event);
    });


    socket.on('LovedEvent', function (event) {
        addChatMessage(event)
    });

    socket.on('CatJoinedEvent', function (event) {
        log(event.username + ' joined');
        addParticipantsMessage(event);
    });

    socket.on('CatLeftEvent', function (event) {
        log(event.username + ' left');
        addParticipantsMessage(event);
        removeChatTyping(event);
    });

    socket.on('Typing', function (event) {
        console.log("Client consuming Typing event ", event)
        addChatTyping(event);
    });

    socket.on('StopTyping', function (event) {
        removeChatTyping(event);
    });
});

