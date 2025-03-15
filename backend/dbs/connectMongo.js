import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("MONGODB connected : ", conn.connection.host);
  } catch (error) {
    console.log("MONGODB connection failed : ", error);
    process.exit(1);
  }
};

export default connectDB;
