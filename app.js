import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import {
  broadcastUpadtedUsersList,
  broadcastUpdatedCountOfUsersJoined,
  handleNewMsgBroadcast,
} from "./io/broadcast.js";
import {
  sendJoinedUserListToNewjoinee,
  sendPreviousChatsToNewUser,
} from "./io/emit.js";
import { handleUserTyping } from "./io/on.js";

let countOfUsersJoined = 0;
let listOfUsersJoined = [];

const app = express();
app.use(express.static(path.resolve("client")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(
    `socket connection is established: a user joined with id:${socket.id}`
  );
  countOfUsersJoined += 1;
  socket.on("newUserJoined", (userName) => {
    socket.userName = userName;
    listOfUsersJoined = [
      ...listOfUsersJoined,
      { id: socket.id, name: userName },
    ];
    sendPreviousChatsToNewUser(socket);
    sendJoinedUserListToNewjoinee(socket, listOfUsersJoined);
    broadcastUpadtedUsersList(socket, listOfUsersJoined);
  });

  handleNewMsgBroadcast(socket);
  handleUserTyping(socket);

  // user disconnected
  socket.on("disconnect", () => {
    countOfUsersJoined -= 1;
    listOfUsersJoined = listOfUsersJoined.filter((user) => {
      return user.id !== socket.id;
    });

    broadcastUpdatedCountOfUsersJoined(socket, countOfUsersJoined);
    broadcastUpadtedUsersList(socket, listOfUsersJoined);
    console.log(
      `socket connection disconnected for user ${socket.userName} id: ${socket.id}`
    );
  });
});

app.get("/", (req, res) => {
  const indexHtmlpath = path.resolve("client", "index.html");
  res.sendFile(indexHtmlpath);
});

export default server;
