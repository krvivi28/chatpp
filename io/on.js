export const handleUserTyping = (socket) => {
  socket.on("userTyping", (userName) => {
    socket.broadcast.emit("userTypingBroadcast", userName);
  });
  socket.on("userTypingCompleted", (userName) => {
    socket.broadcast.emit("userTypingCompletedBroadcast", userName);
  });
};
