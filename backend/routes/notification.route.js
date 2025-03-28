import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  deleteNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

//this route fetch the all notification
router.get("/", protectRoute, getNotifications);

//delete the notification
router.delete("/", protectRoute, deleteNotifications);

export default router;
