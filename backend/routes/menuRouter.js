import { Router } from "express"
import FoodItem from "../models/foodItems.js"

const router = Router();

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getISTDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

router.get("/", async (req, res) => {
  try {
    const istNow = getISTDate();
    const dayName = days[istNow.getDay()];

    const foodItems = await FoodItem
      .find({ day: dayName })
      .populate("chefId");

    foodItems.sort((a, b) => b.chefId.subscribed - a.chefId.subscribed);

    res.status(200).json(foodItems);
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
