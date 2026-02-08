import { Router } from "express";
import { validateToken } from "../services/authentication.js";
import FoodItem from "../models/foodItems.js";
import client from "../client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = validateToken(token);
    // console.log("hello ", req.user._id);
    const CacheMyItems = await client.get(`myitems:${req.user._id}`);
    if(CacheMyItems) return res.json(JSON.parse(CacheMyItems));


    const foodItems = await FoodItem.find({ chefId: payload._id});
    await client.set(`myitems:${req.user._id}`, JSON.stringify(foodItems));
    await client.expire(`myitems:${req.user._id}`, 60)

    return res.json(foodItems);
  } catch (error) {
    console.error("Error fetching user items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
