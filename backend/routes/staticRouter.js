import FoodItem from "../models/foodItems.js";
import User from "../models/user.js"
import { Router } from "express"

const router = Router();


router.get('/subs', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const date_of_expire = user.date_of_expire;

        if (date_of_expire == null) {
            return res.status(200).json({ "doe": null, chk: false });
        }

        return res.status(200).json({ "doe": date_of_expire, "chk": true });
    } catch (error) {
        return res.send(error)
    }
})

router.post('/subs', async (req, res) => {
    // console.log("post of sub");
    // console.log(req.body.chk);
    const chk = req.body.chk;

    if (!chk) {
        // console.log("post naa");

        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, { date_of_purchase: null, date_of_expire: null, subscribed: false });
    }

    return res.status(200).json({ "doe": null, chk: false });
})

router.delete("/subs", async (req, res) => {
    try {
        const today = new Date();
        const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const today_Day = day[today.getDay()];

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

router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, messName, messAddress } = req.body;

        await User.create({ fullName, email, password, messName, messAddress });

        return res.status(200).json({ message: "Signup successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Signup failed" });
    }
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    // console.log(email,password);

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie('token', token, {
            httpOnly: true,
            secure: true,        // true in production (HTTPS), false on local dev
            sameSite: 'none',      // required for cross-site cookies
            maxAge: 1000 * 60 * 60 * 24 * 7,
            // domain: '.karve-mess.onrender.com' // optional — usually not needed if default works
        }).json({ message: "Login Successful" });

    } catch (err) {
        console.error(err);
        console.log("Error in backend POST LOgin");

        return res.status(500).json({ error: "Signup failed" });
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logout Successful" });
})

export default router