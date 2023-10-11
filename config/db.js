import mongoose from "mongoose";

const connectToDb = async () => {
  console.log("connection to db...");
  try {
    await mongoose.connect("mongodb://localhost:27017/chatApp");
    console.log("mongodb is connected");
  } catch (error) {
    console.log(`db connection failed with error: ${error}`);
  }
};

export default connectToDb;
