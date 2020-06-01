export default class Chat {
  constructor () {
    this.userName = document.getElementById('user-name');
    this.userMessage = document.getElementById('user-message');
    this.messageContainer = document.getElementsByClassName('chat-messages')[0];
    this.setupSocket();
    this.setupEvents();
  }

  setupSocket() {
    this.socket = io('http://35.157.80.184:8080/');

    this.socket.on('connect_failed', () => {
      this.socket.close();
    });

    this.socket.on('disconnect', () => {
      this.socket.close();
    });
  }

  setupEvents() {
    const submitButton = document.getElementById('submit');

    //Validate message on enter
    this.userMessage.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.validateMessage();
      }
    });

    submitButton.addEventListener('click', (event) => {
      this.validateMessage();
    });

    //Listen for new messages come from the server
    this.socket.on('message', (data) => {
      if ( data.user ) {
        this.addNewLine(data);
      }
    })
  }

  validateMessage() {
    const message = this.userMessage.value;

    //check if message is not empty and has non whitespace value
    if (message.length && /\S/.test(message)) {
      this.sendMessage(message);
    } else {
      alert('Please enter a valid message to send!');
    }
  }

  sendMessage(message) {
    const user = this.userName.value || 'Guest';
    this.socket.emit('message', message);
    this.addNewLine(message, true);
    this.userMessage.value = '';
  }

  scrollDownToMessage() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  addNewLine(message, ownMessage) {
    const messageBox = document.createElement('div');
    messageBox.classList.add(ownMessage ? 'outgoing' : 'incoming', 'message-item');

    if (typeof message === 'object') {
      messageBox.innerHTML = `${message.user}: ${message.message}`;
    } else {
      messageBox.innerHTML = message;
    }

    this.messageContainer.appendChild(messageBox);
    this.scrollDownToMessage();
  }
}
