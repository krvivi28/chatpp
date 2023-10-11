import server from "./app.js";
import connectToDb from "./config/db.js";

server.listen(3000, async (err) => {
  if (err) {
    console.log("server connection failed with error: " + err);
  } else {
    await connectToDb();
    console.log("server is running at port 3000");
  }
});
