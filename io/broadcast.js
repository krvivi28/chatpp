import { saveNewChat } from "../feature/chat/char.repository.js";

export const handleNewMsgBroadcast = (socket) => {
  socket.on("new_message_received", async (msg) => {
    let newChatInfo = { userName: socket.userName, msg, id: socket.id };
    await saveNewChat(newChatInfo);
    socket.broadcast.emit("broadcast_msg", newChatInfo);
  });
};

export const broadcastUpdatedCountOfUsersJoined = (socket, count) => {
  socket.broadcast.emit("updatedCurrentCountofUsersJoined", count);
};

export const broadcastUpadtedUsersList = (socket, usersList) => {
  socket.broadcast.emit("usersListUpdated", usersList);
};
