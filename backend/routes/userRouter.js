import { Router } from "express"
import User from "../models/user.js";
import FoodItem from "../models/foodItems.js";

const router = Router();

router.get("/", (req,res) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json(user);
})

router.patch("/", async(req,res) => {
    try {
        console.log("patch was called");
        
        const {chefid, subscribed, date_of_purchase, date_of_expire} = req.body;
        const updateUser = await User.findByIdAndUpdate(chefid, {$set: {subscribed: false, date_of_purchase: null, date_of_expire: null}});
        return res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        
    }
})

router.delete("/", async (req, res) => {
    try {
        const today = new Date();
        const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const today_Day = day[today.getDay()];
        console.log("deleted item");
        
        await FoodItem.deleteMany({
            chefId: req.user._id,
            day: { $ne: today_Day }
        });
        return res.status(204).send();

    } catch (error) {
        console.log("error iind dlt ");

        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


export default router;