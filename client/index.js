// connecting to socket library running at http://localhost:3000
// const socket = io.connect("http://localhost:3000/");
const socket = io.connect();
console.log(socket);

// initializing dom elements
const userLoggedInNameSpan = document.getElementById("userNameSpan");
const prevMsgListBoxOfSender = document.getElementById("sender");
const prevMsgListBoxOfReceiver = document.getElementById("receiver");
const inputText = document.getElementById("msgbox");
const sendBtn = document.getElementById("sendbtn");
const connectedUsers = document.getElementById("connectedUsers");
const connected_users = document.getElementById("connected_users");
const typing = document.getElementById("typing");
const inputElement = document.getElementById("myInput");
const showCountOfConnectedUser = document.getElementById(
  "showCountOfConnectedUser"
);
let userListInfo;

// taking name input of user joined and emitting user_joined event
let userName = window.prompt("enter your name").toLocaleLowerCase();
if (!userName) {
  window.alert("name can't be empty");
  userName = window.prompt("enter your name");
} else {
  socket.emit("newUserJoined", userName);
  userLoggedInNameSpan.innerText = `welcome ${userName}`;
}

// sending a message broadcast
socket.on("broadcast_msg", (newMsg) => {
  let broadCastingUserInd = userListInfo.findIndex((user) => {
    return user.id == newMsg.id;
  });
  console.log(broadCastingUserInd);

  appendMessage(
    newMsg.userName,
    BOT_IMG[broadCastingUserInd % 5],
    "left",
    newMsg.msg
  );
});

// rendering previous chats
socket.on("prevChats", (msgs) => {
  console.log(msgs);

  msgs.forEach((msg, ind) => {
    appendMessage(
      msg.userName,
      BOT_IMG[ind % 5],
      "left",
      msg.userMsg,
      new Date(msg.createdAt)
    );
  });
});

// render joined users list to new joinee
socket.on("joineduserList", (users) => {
  userListInfo = users;
  updateCurrentUserCountOnUi(users);
});

// re-render joined users list after a user left the connection
socket.on("usersListUpdated", (users) => {
  console.log("re-render", users);
  userListInfo = users;
  updateCurrentUserCountOnUi(users);
});

// ui

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = [
  "images/superhero.png",
  "images/batman.png",
  "images/dinosaur.png",
  "images/koala.png",
  "images/ninja.png",
];
const PERSON_IMG = "images/spiderman.png";

const PERSON_NAME = userName;

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  socket.emit("new_message_received", msgText);
});

function appendMessage(name, img, side, text, date = new Date()) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(date)}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const updateCurrentUserCountOnUi = (users) => {
  connected_users.innerHTML = "";
  showCountOfConnectedUser.innerHTML = "";
  let userCountToDisplay = ` <button
              type="button"
              class="list-group-item list-group-item active">
              connected users ${users.length}
            </button>`;
  // showCountOfConnectedUser.innerHTML = userCountToDisplay;
  showCountOfConnectedUser.insertAdjacentHTML("beforeend", userCountToDisplay);

  Array.from(users).forEach((user) => {
    let userNameToDisplay = ` <button
              type="button"
              class="list-group-item list-group-item-success">
             <span id="status-dot" class="mx-1"></span>
              ${user.name}
            </button>`;
    connected_users.insertAdjacentHTML("beforeend", userNameToDisplay);
  });

  msgerChat.scrollTop += 500;
};

// showing if user is typing or not
inputElement.addEventListener("input", function () {
  socket.emit("userTyping", userName);
});

inputElement.addEventListener("change", function () {
  socket.emit("userTypingCompleted", userName);
});

socket.on("userTypingBroadcast", (userName) => {
  typing.innerHTML = `<em>${userName} typing...</em>`;
});
socket.on("userTypingCompletedBroadcast", (userName) => {
  typing.innerHTML = "";
});
