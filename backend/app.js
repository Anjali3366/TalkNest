import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import connectDB from "./dbs/connectMongo.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log("server Listening at ", PORT);
  connectDB();
});
