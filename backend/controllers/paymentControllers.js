import { instance } from "../index.js"
import crypto from "crypto"
import User from "../models/user.js"

export const processPayment = async(req,res) => {
    const option ={
        amount:Number(req.body.amount*100),
        currency: "INR",
    }

    const order = await instance.orders.create(option);

    res.status(200).json({
        success: true,
        order
    })
}

export const getKey = (req,res) => {
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
}


export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields' });
    }

    const secret = process.env.RAZORPAY_API_SECRET;
    if (!secret) {
      console.error('Missing RAZORPAY_API_SECRET env var!');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.warn('Signature mismatch', { expectedSignature, razorpay_signature });
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Determine userId safely:
    // Option A (preferred if request has auth): req.user set by auth middleware
    let userId = req.user?. _id;
    // Option B (if this endpoint is called by Razorpay/webhook): expect userId in body or find via order metadata
    if (!userId) userId = req.body.userId || null;

    if (!userId) {
      // If you can't identify user, don't crash — return an error and log for debugging
      console.error('No userId provided and no authenticated user. req.user:', !!req.user);
      return res.status(400).json({ success: false, message: 'User identification missing' });
    }

    const date_of_purchase = new Date();
    const date_of_expire = new Date();
    date_of_expire.setMinutes(date_of_expire.getMinutes() + 2);

    await User.findByIdAndUpdate(userId, {
      subscribed: true,
      date_of_purchase,
      date_of_expire
    }, { new: true });

    // If frontend initiated request (AJAX), respond JSON. If you expect browser redirect, redirect.
    const front = process.env.FRONTEND_URL;
    if (front) {
      return res.redirect(`${front}/user`);
    } else {
      return res.status(200).json({ success: true, message: 'Payment verified' });
    }
  } catch (err) {
    console.error('paymentVerification error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
