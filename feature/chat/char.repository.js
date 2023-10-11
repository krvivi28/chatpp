import chatModel from "./chat.schema.js";

export const saveNewChat = async (chat) => {
  const newChat = new chatModel({
    userName: chat.userName,
    userMsg: chat.msg,
    timestamp: new Date().toISOString(),
  });
  await newChat.save();
};

export const getAllChats = async () => {
  return await chatModel.find({});
};
