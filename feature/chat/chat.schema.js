import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    userMsg: {
      type: String,
    },
    timestamp: {
      type: Date,
    },
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
