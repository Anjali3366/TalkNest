import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token; //find the token

    // check the token is present or not
    if (!token) {
      return res.status(400).json({ error: "Token not Provided ! " });
    }

    // decode the token from cookies
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    // if decodedtoken is not here
    if (!decodeToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findById(decodeToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not Found! " });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware : ", err.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};
