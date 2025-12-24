import FoodItem from "../models/foodItems.js";
import User from "../models/user.js"
import { Router } from "express"

const router = Router();


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
    console.log(email,password);

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie('token', token
            ,{
            httpOnly: true,
            secure: true,        // true in production (HTTPS), false on local dev
            sameSite: 'None',
            path: "/",      // required for cross-site cookies
            domain: '.karve-mess.vercel.app', // optional — usually not needed if default works
            maxAge: 1000 * 60 * 60 * 24 * 7,
        }
    ).json({ message: "Login Successful" });

    } catch (err) {
        console.error(err);
        console.log("Error in backend POST LOgin");

        return res.status(500).json({ error: "Signup failed" });
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token"
        , {
            httpOnly: true,
            secure: true,        // true in production (HTTPS), false on local dev
            sameSite: 'None',
            path: "/",      // required for cross-site cookies
            domain: '.karve-mess.vercel.app',
            // maxAge: 0,
        }
    ).json({ message: "Logout Successful" });
})

export default router