import JWT from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const secret = process.env.JWT_SECRET;

export function createTokenForUser(user){
    const payload = {
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        messName:user.messName,
        messAddress:user.messAddress,
        subscribed:user.subscribed,
    }
    const token = JWT.sign(payload,secret);

    return token;
}

export function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

