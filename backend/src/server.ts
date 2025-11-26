import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const start = async () => {
  try {
    // Validate MongoDB URI format
    if (!config.MONGO_URI || !config.MONGO_URI.startsWith("mongodb")) {
      throw new Error("Invalid MONGO_URI format. Must start with 'mongodb://' or 'mongodb+srv://'");
    }
    
    console.log(`Connecting to MongoDB...`);
    console.log(`URI: ${config.MONGO_URI.replace(/:[^:@]+@/, ':****@')}`); // Hide password in logs
    
    // Add connection options for better error handling
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log("MongoDB connected successfully");
    
    const port = process.env.PORT || config.PORT;
    app.listen(port, "0.0.0.0", () => {
      console.log(`${config.APP_NAME} API listening on port ${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
    });
  } catch (error: any) {
    console.error("Failed to start server:", error.message);
    
    if (error.message?.includes("URI malformed")) {
      console.error("\n❌ MongoDB URI is malformed. Check your MONGO_URI in .env file.");
      console.error("Format should be: mongodb+srv://username:password@cluster.mongodb.net/database");
      console.error("Special characters in password must be URL-encoded (e.g., @ becomes %40)");
    } else if (error.message?.includes("ENOTFOUND") || error.message?.includes("querySrv")) {
      console.error("\n❌ DNS resolution failed. Possible issues:");
      console.error("1. Check your internet connection");
      console.error("2. Verify the MongoDB Atlas cluster hostname is correct");
      console.error("3. Ensure the MongoDB Atlas cluster is running (not paused)");
      console.error("4. Check if your IP is whitelisted in MongoDB Atlas Network Access");
      console.error("5. Try using 'mongodb://' instead of 'mongodb+srv://' if DNS issues persist");
      console.error("\nCurrent URI host:", config.MONGO_URI.match(/@([^/]+)/)?.[1] || "unknown");
      console.error("\n💡 Quick fix: Use local MongoDB for development");
      console.error("   Update MONGO_URI in .env to: mongodb://localhost:27017/scan-sehat");
      console.error("   See backend/MONGODB_TROUBLESHOOTING.md for more help");
    } else if (error.message?.includes("authentication failed")) {
      console.error("\n❌ Authentication failed. Check:");
      console.error("1. Username and password are correct");
      console.error("2. Database user exists in MongoDB Atlas");
      console.error("3. Password special characters are URL-encoded");
    } else {
      console.error("\n❌ MongoDB connection error:", error.name || "Unknown error");
      console.error("Error details:", error.message);
    }
    
    process.exit(1);
  }
};

start();
