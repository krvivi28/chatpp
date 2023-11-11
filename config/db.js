import mongoose from "mongoose";
// db for krvivi28 mongodb+srv://echo:vivek28@echo.smg3wtt.mongodb.net/?retryWrites=true&w=majority
// db for storefeet mongodb+srv://echo:vivek@storefleet.dh4wfxc.mongodb.net/?retryWrites=true&w=majority
const connectToDb = async () => {
  console.log("connection to db...");
  try {
    await mongoose.connect(
      "mongodb+srv://echo:vivek@storefleet.dh4wfxc.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("mongodb is connected");
  } catch (error) {
    console.log(`db connection failed with error: ${error}`);
  }
};

export default connectToDb;
