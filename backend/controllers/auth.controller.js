import { genSalt, hash, compare } from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../library/Utils/generateToken.js";

export const signup = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid E-mail format " });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exist! " });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password should be 8 character long ! " });
    }
    // hashed the password

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    // generate newUser
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    // save the newUser to mongoDB
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        userImg: newUser.userImg,
        coverImg: newUser.coverImg,
        link: newUser.link,
      });
    } else {
    }
  } catch (err) {
    console.log("Error in Signup controller : ", err.message);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await compare(password, user?.password || "");
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      followers: user.followers,
      following: user.following,
      userImg: user.userImg,
      coverImg: user.coverImg,
    });
  } catch (err) {
    console.log("Error in Login controller: ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth_token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully !" });
  } catch (err) {
    console.log("Error in Logout Controller: ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// find the user details
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.log("Error in getMe controller : ", err.message);
    res.status(500).json("Internal Server Error ");
  }
};
