import express from "express";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import mongoose from "mongoose";
const app = express();

const PORT = 1256;

app.use(express.json());
app.use(express.static("public"));
//Routes
app.use("/auth", AuthRoutes);

//Mongo Connections:
const MongoURI = "mongodb://127.0.0.1:27017/ProjectManagement";

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("Connected to the MongoDB");
  })
  .catch((err) => console.error("Couldn't connect to the mongoDb"));

//Listening to port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
