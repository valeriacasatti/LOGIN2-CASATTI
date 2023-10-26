import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.url);
    console.log("database connected");
  } catch (error) {
    console.log(`error connecting database: ${error.message}`);
  }
};
