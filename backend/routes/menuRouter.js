import { Router } from "express"
import FoodItem from "../models/foodItems.js"
// import client from "../client.js";

const router = Router();

const today = new Date();
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// const dayName = days[today.getDay()];

console.log("today", today);


router.get("/", async (req,res) => {
  const today = new Date();
  const dayName = days[today.getDay()];
  console.log("dayname", dayName);
    //  const CacheFoodItems = await client.get("fooditems")
    //  if(CacheFoodItems) return res.status(200).json(JSON.parse(CacheFoodItems));

    const foodItems = await FoodItem.find({day: dayName}).populate("chefId");
    foodItems.sort(
  (a, b) => b.chefId.subscribed - a.chefId.subscribed
);
    // console.log(foodItems);
    // await client.set("hello", 1);
    // await client.set('fooditems', JSON.stringify(foodItems));
    // await client.expire('fooditems', 50);
    
    res.status(200).json(foodItems);
});

export default router;
