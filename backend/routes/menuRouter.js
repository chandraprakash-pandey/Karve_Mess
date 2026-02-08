import { Router } from "express"
import FoodItem from "../models/foodItems.js"
import client from "../client.js";


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

    const CacheMenu = await client.get(`menu:${dayName}`);
    if(CacheMenu) return res.json(JSON.parse(CacheMenu));

    const foodItems = await FoodItem
      .find({ day: dayName })
      .populate("chefId");

    foodItems.sort((a, b) => b.chefId.subscribed - a.chefId.subscribed);
    await client.set(`menu:${dayName}`, JSON.stringify(foodItems));
    await client.expire(`menu:${dayName}`, 60);

    res.status(200).json(foodItems);
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
