import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error(
        "MONGO_URL is missing from the .env file"
      );
    }

    const conn = await mongoose.connect(
      process.env.MONGO_URL,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(
      "\n❌ MongoDB Connection Error"
    );

    console.error(
      "Error name:",
      error.name
    );

    console.error(
      "Error message:",
      error.message
    );

    if (error.reason?.servers) {
      console.error("\nServer errors:");

      for (const [server, details] of error.reason.servers) {
        console.error(
          `Server: ${server}`
        );

        console.error(
          "Error:",
          details.error?.message ||
            details.type
        );
      }
    }

    throw error;
  }
};

export default connectDB;