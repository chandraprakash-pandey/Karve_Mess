import { Router } from "express"
import User from "../models/user.js";
import FoodItem from "../models/foodItems.js";

const router = Router();

// get user details
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "_id fullName role messName messAddress subscribed"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// update the user's specific details
router.patch("/", async (req, res) => {
  try {
    const { subscribed, date_of_purchase, date_of_expire } = req.body;

    // Only allow users to update their own subscription
    const updateData = {
      subscribed: subscribed ?? false,
      date_of_purchase: date_of_purchase ?? null,
      date_of_expire: date_of_expire ?? null,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, select: "_id fullName role messName messAddress subscribed" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// delete the user's specific details
router.delete("/", async (req, res) => {
  try {
    const today = new Date();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayDay = dayNames[today.getDay()];

    await FoodItem.deleteMany({
      chefId: req.user._id,
      day: { $ne: todayDay },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting food items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;