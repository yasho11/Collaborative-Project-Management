import express from "express";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import WorkspaceRoutes from "./routes/WorkSpaceRoutes";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));
//Routes
app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/workspaces", WorkspaceRoutes);
//Mongo Connections:
const MongoURI = process.env.MONGO_URI;
if (MongoURI) {
  mongoose
    .connect(MongoURI)
    .then(() => {
      console.log("Connected to the MongoDB");
    })
    .catch((err) => console.error("Couldn't connect to the mongoDb"));
} else {
  console.error("Monog URI not found!");
}
if (PORT) {
  //Listening to port
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else {
  console.log("PORT not found");
}
