import { instance } from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/user.js";

// function for creating payment order
export const paymentOrder = async (req, res) => {
  try {
    // creating the options for the order
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now() + Math.floor(Math.random() * 10)}`,
    };

    const order = await instance.orders.create(options); // creating the order
    if (!order)
      return res.status(500).json({
        success: false,
        message: "Some error occurred while creating order",
      }); // return error if order is not able to be created

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("[PAYMENT ORDER ERROR]: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// function for getting razorpay key
export const getKey = (req, res) => {
  if (!process.env.RAZORPAY_API_KEY) {
    return res.status(500).json({
      message: "RAZORPAY_API_KEY not configured",
    });
  }
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
};

// function for verifying payment
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment fields" });
    } // validating the required fields

    // checking razorpay secrets are loaded properly or not
    const secret = process.env.RAZORPAY_API_SECRET;
    if (!secret) {
      console.error("Missing RAZORPAY_API_SECRET environment variable");
      return res
        .status(500)
        .json({ success: false, message: "Server misconfiguration" });
    }

    // verifying the signature
    const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyString)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Payment signature mismatch", {
        expectedSignature,
        razorpay_signature,
      });
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    } // return error if the signature does not match

    // identifying the user to update the subscription
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      console.error(
        "Cannot identify user: req.user missing and no userId in body",
      );
      return res
        .status(400)
        .json({ success: false, message: "User identification missing" });
    }

    // updating user's subscription status
    const now = new Date();
    const expireDate = new Date(now);
    expireDate.setMinutes(expireDate.getMinutes() + 10); 
    // subscription valid for 10 minutes for testing but in real it will be days or months accordingly

    await User.findByIdAndUpdate(
      userId,
      {
        subscribed: true,
        date_of_purchase: now,
        date_of_expire: expireDate,
      },
      { new: true },
    );

    return res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("paymentVerification error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
