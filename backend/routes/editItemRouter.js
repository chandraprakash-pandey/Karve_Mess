import { Router } from "express"
import FoodItem from "../models/foodItems.js"


const router = Router();

router.get("/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const item = await FoodItem.findOne({ _id: itemId , chefId: req.user._id});

    // console.log(req.user._id);
    return res.json(item);
});

router.patch("/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        const { item } = req.body;

        const updatedItem = await FoodItem.findOneAndUpdate({ _id: itemId }, { item }, { new: true });
        return res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.delete("/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        await FoodItem.findOneAndDelete({ _id: itemId });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;