import Razorpay from "razorpay";

let createInstance; // variable to hold the razorpay instance

// function to initialize razorpay instance
export const initRazorpay = () => {
  if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET)
    throw new Error(
      "Razorpay API credentials are not defined or not loaded from environment variables",
    ); // checking beforehand if the env variables are loaded properly

  createInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  console.log("Razorpay instance successfully initialized"); // success
};

// exporting the instance after verification
export const instance = () => {
  if (!createInstance) {
    throw new Error("Razorpay instance is not initialized");
  }
  return createInstance;
};
