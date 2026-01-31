import JWT from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

// Return if the secret is not loaded properly
if (!secret)
  throw new Error("JWT_SECRET not defined or .env not loaded properly");

// Creating token for users
export function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    // email: user.email, // //excluding email from payload for privacy
    fullName: user.fullName,
    role: user.role,
    messName: user.messName,
    messAddress: user.messAddress,
    subscribed: user.subscribed,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "7d" });

  return token;
}

// Validating token for users
export function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (err) {
    throw new Error("Invalid or expired Token");
  }
}
