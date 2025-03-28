import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getProfile,
  suggestedUsers,
  followOrUnfollowUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.get("/suggested", protectRoute, suggestedUsers);
router.post("/follow/:id", protectRoute, followOrUnfollowUser);
router.post("/update/", protectRoute, updateUserProfile);

export default router;
