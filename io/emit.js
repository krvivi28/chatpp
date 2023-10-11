import { getAllChats } from "../feature/chat/char.repository.js";

export const sendCurrentUsersCountToNewJoinee = (socket, count) => {
  socket.emit("countOfCurrentUsersJoined", count);
};

export const sendPreviousChatsToNewUser = async (socket) => {
  const allPrevChats = await getAllChats();
  socket.emit("prevChats", allPrevChats);
};

export const sendJoinedUserListToNewjoinee = (socket, userList) => {
  socket.emit("joineduserList", userList);
};
