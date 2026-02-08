import { Router } from "express"
import FoodItem from "../models/foodItems.js"
import client from "../client.js";


const router = Router();

router.get("/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const item = await FoodItem.findOne({ _id: itemId, chefId: req.user._id });

    // console.log(req.user._id);
    return res.json(item);
});



router.patch("/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        const { item } = req.body;
        const now = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        const day = now.getDay();
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        const updatedItem = await FoodItem.findOneAndUpdate({ _id: itemId }, { item }, { new: true });
        await client.del("fooditems");
        await client.del(`myitems:${req.user._id}`);
        await client.del(`menu:${days[day]}`);

        return res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.delete("/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        const now = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        const day = now.getDay();
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        await FoodItem.findOneAndDelete({ _id: itemId, chefId: req.user._id });

        await client.del("fooditems");
        await client.del(`myitems:${req.user._id}`);
        await client.del(`menu:${days[day]}`);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;