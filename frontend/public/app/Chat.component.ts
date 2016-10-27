/**
 * Created by prayagupd on 10/26/16.
 */

import {Component}        from '@angular/core';
import {OnInit}         from '@angular/core'

@Component({
    selector: 'ChatView',
    template: `
<ul class="pages">

    <li class="chat page">
      <div class="chatArea">
        <ul class="messages"></ul>
      </div>
      <input class="inputMessage" placeholder="Send love..."/>
    </li>

    <li class="login page">
      <div class="form">
        <h3 class="title">username?</h3>
        <input class="usernameInput" type="text" maxlength="14" />
      </div>
    </li>
  </ul>
`,

    styles: [`
* {
  box-sizing: border-box;
}

html {
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

html, input {
  font-family:
    "HelveticaNeue-Light",
    "Helvetica Neue Light",
    "Helvetica Neue",
    Helvetica,
    Arial,
    "Lucida Grande",
    sans-serif;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
  word-wrap: break-word;
}

/* Pages */

.pages {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

.page {
  height: 100%;
  position: absolute;
  width: 100%;
}

/* Login Page */

.login.page {
  background-color: #000;
}

.login.page .form {
  height: 100px;
  margin-top: -100px;
  position: absolute;

  text-align: center;
  top: 50%;
  width: 100%;
}

.login.page .form .usernameInput {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding-bottom: 15px;
  text-align: center;
  width: 400px;
}

.login.page .title {
  font-size: 200%;
}

.login.page .usernameInput {
  font-size: 200%;
  letter-spacing: 3px;
}

.login.page .title, .login.page .usernameInput {
  color: #fff;
  font-weight: 100;
}

/* Chat page */

.chat.page {
  display: none;
}

/* Font */

.messages {
  font-size: 150%;
}

.inputMessage {
  font-size: 100%;
}

.log {
  color: gray;
  font-size: 70%;
  margin: 5px;
  text-align: center;
}

/* Messages */

.chatArea {
  height: 100%;
  padding-bottom: 60px;
}

.messages {
  height: 100%;
  margin: 0;
  overflow-y: scroll;
  padding: 10px 20px 10px 20px;
}

.message.Typing .messageBody {
  color: gray;
}

.username {
  font-weight: 700;
  overflow: hidden;
  padding-right: 15px;
  text-align: right;
}

/* Input */

.inputMessage {
  border: 10px solid #000;
  bottom: 0;
  height: 60px;
  left: 0;
  outline: none;
  padding-left: 10px;
  position: absolute;
  right: 0;
  width: 100%;
}
`]
})

export class ChatComponent implements OnInit {
    title = "Chat";

    ngOnInit(): void {
        console.log("Chat")
    }
}
