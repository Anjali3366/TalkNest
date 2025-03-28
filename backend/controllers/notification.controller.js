import Notification from "../models/notification.model.js";

// get all notification of logged user
export const getNotifications = async (req, res) => {
  try {
    // get the user id

    const userId = req.user._id;
    // fetch the notification by the help of userid and to field & check the notification is exist or not
    console.log(userId);
    const notification = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "from",
        select: "username userImg",
      });
    // update read field in  the all notification

    await Notification.updateMany({ to: userId }, { $set: { read: true } });
    // send the notification in response
    res.status(200).json(notification);
  } catch (err) {
    console.log("Error in getNotifications controller : ", err.message);
    res.status(500).json({ error: "Internal server Error !" });
  }
};
// delete all notification of logged in User
export const deleteNotifications = async (req, res) => {
  try {
    // fetch the userid
    const userId = req.user._id;
    // delete the notification by deleteMany function

    await Notification.deleteMany({ to: userId });
    res.status(202).json({ message: "Notification deleted successfully ! " });
  } catch (err) {
    console.log("Error in getNotifications controller : ", err.message);
    res.status(500).json({ error: "Internal server Error !" });
  }
};
