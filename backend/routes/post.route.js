import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeOrUnlikePost,
  getAllPost,
  getLikedPost,
  getAllFollowingPost,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();
// get all the posts in db
router.get("/all", protectRoute, getAllPost);

// get the all post of following users
router.get("/following", protectRoute, getAllFollowingPost);

// get the all the post of logged in user
router.get("/user/:username", protectRoute, getUserPosts);

// get all post that are liked by logged in user
router.get("/likes/:userId", protectRoute, getLikedPost);

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeOrUnlikePost);
router.post("/comment/:postId", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
