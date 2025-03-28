import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// this function gives all the posts in db
export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });

    if (allPost.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(allPost);
  } catch (err) {
    console.log("Error in getAllPost controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error ! " });
  }
};

// this function responsible for creating posts
export const createPost = async (req, res) => {
  try {
    // get text image userid  and check user exists or not
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    if (!userId) {
      return res.status(404).json({ error: "User not found ! " });
    }
    // if there is no img and text send error
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have image or  text " });
    }
    // upload the image to cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    // make new post
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    console.log("Error in createPost controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error ! " });
  }
};
// it is responsible to like or unlike the post
export const likeOrUnlikePost = async (req, res) => {
  try {
    // get the userid ,  post id
    const userId = req.user._id;
    const { id: postId } = req.params;

    // get the post and check if it present
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found! " });
    }
    // check if user already like this or not if yes then unlike the post
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully " });
    } else {
      // like the post
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      // create the notification
      const newNotification = new Notification({
        type: "like",
        from: userId,
        to: post.user,
      });

      await newNotification.save();

      res.status(200).json({ message: "Post liked successfully ! " });
    }
  } catch (err) {
    console.log("Error in likeOrUnlikePost controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error ! " });
  }
};

// responsible for commenting on post
export const commentOnPost = async (req, res) => {
  try {
    // fetch text , postid , userid from respective place
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user._id;
    console.log(postId);
    // check text field is present
    if (!text) {
      return res.status(400).json({ error: "Text is required for comments" });
    }

    // check post is present in mongodb
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    // create a comments and push it
    const newComment = { text, user: userId };
    post.comments.push(newComment);

    // save the comment in mongodb
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.log("Error in commentOnPost controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error ! " });
  }
};

// responsible for deleting the post
export const deletePost = async (req, res) => {
  try {
    // fetch the postid and find and check if post owner is deleting or any other one

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found ! " });
    }

    if (post.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorize to delete this post ! " });
    }
    // if there is any image in post so delete from cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    //delete the document of post from mongodb

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully ! " });
  } catch (err) {
    console.log("Error in deletePost controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error ! " });
  }
};

// this function return the all post liked by user
export const getLikedPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }

    const allLikedPost = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });

    res.status(200).json(allLikedPost);
  } catch (err) {
    console.log("Error in getLikedPost controller: ", err.message);
    res.status(500).json({ error: "Internal server error ! " });
  }
};

// responsible for feteching all the post of  the following users
export const getAllFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    // check the user exist or not
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found ! " });
    }

    // get allfollowing and their post from user

    const allFollowing = user.following;
    console.log("All Following are  : ", allFollowing);

    const allFollowingPosts = await Post.find({ user: { $in: allFollowing } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });

    res.status(200).json(allFollowingPosts);
  } catch (err) {
    console.log("Error in getFollowingsPost controller: ", err.message);
    res.status(500).json({ error: "Internal server error ! " });
  }
};

// responsible for fetching the post of logged in user
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    // find the user from db and check if it is exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }

    //find the post of user
    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-email -password",
      });
    res.status(200).json(userPosts);
  } catch (err) {
    console.log("Error in getUserPosts controller: ", err.message);
    res.status(500).json({ error: "Internal server error ! " });
  }
};
