import mongoose from "mongoose";

// Database connection function
export const dbConnection = async () => {
  try {
    // Check if the database connection string is loaded properly or not
    if (!process.env.MONGO_URI)
      throw new Error("MONGO_URI is not defined in environment variables");

    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to database");
      return;
    } // if already connected return 

    await mongoose.connect(process.env.MONGO_URI); // connecting to the database

    console.log("DB Connected successfully..!!");
  } catch (error) {
    console.error("Error connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};
