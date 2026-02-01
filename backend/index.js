import "dotenv/config"; // importing the enviroment variables
import app from "./app.js";
import { dbConnection } from "./config/dbConnection.js";
import { initRazorpay } from "./config/razorpay.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnection();

    initRazorpay();

    app.use(morgan("combined"));

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
