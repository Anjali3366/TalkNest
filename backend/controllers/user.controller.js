import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import { genSalt, hash, compare } from "bcryptjs";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log("Error in getProfile controller : ", err.message);
    res.status(500).json({ error: "Internal Server Erro" });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    // fetch the current user id :
    const userId = req.user._id;

    // fetch the all following of current user
    const userFollowedByMe = await User.findById(userId).select("following");
    // get some user to suggest used a aggregate function of mongoose

    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { size: 10 } },
    ]);
    // filter some user that are not in following by me -- use the filter, includes and slice method

    const filteredUser = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );

    const suggestedUser = filteredUser.slice(0, 4);
    // for each user set the password to null so their password are not visible to other but not in db
    suggestedUser.forEach((user) => {
      return (user.password = null);
    });
    // return the suggestedUsers

    res.status(200).json(suggestedUser);
  } catch (err) {
    console.log("Error in suggestedProfile controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};

export const followOrUnfollowUser = async (req, res) => {
  try {
    // fetch the user id
    const { id } = req.params;

    // fetch the current user and user to modify
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    // checking you are not following yourself
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow / unfollow yourself" });
    }
    // check both the user find from mongodb or not

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found " });
    }
    // check the modifyUser is already in following array or not
    const isFollowing = currentUser.following.includes(id);
    // implement the follow and unfollow logic with if and else

    if (isFollowing) {
      // unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      // TODO : return the id of the user as a response

      res.status(200).json({ message: "User unfollowed successfully ! " });
    } else {
      // follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // send the notification to user

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });

      await newNotification.save();
      // TODO : return the id of the user as a response
      res.status(200).json({ message: "User followed successfully ! " });
    }
  } catch (err) {
    console.log("Error in followOrUnfollowUser controller : ", err.message);
    res.status(500).json({ error: "Internal server error ! " });
  }
};

export const updateUserProfile = async (req, res) => {
  // fetch all the field that user can update with current password and new password

  const { username, fullname, email, link, bio, currentPassword, newPassword } =
    req.body;
  // fetch the image in let container
  let { userImg, coverImg } = req.body;
  // get the id of currentuser
  const userId = req.user._id;
  try {
    //find the user from mongodb
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found ! " });
    }
    // check the both password is provided
    if (
      (!currentPassword && newPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Provide both current password & new password ! " });
    }
    //match the currentpassword to original password of user by bcryptjs method and also check the length of password
    if (currentPassword && newPassword) {
      const isMatch = compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "current Password incorrect ! " });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "New Password must be 8 character long ! ",
        });
      }
      // hased the password
      const salt = await genSalt(10);

      user.password = await hash(newPassword, salt);
    }

    // check if profile image is provided or not

    if (userImg) {
      // destroy the existing image from the cloudinary so that our system is remained free for further storage
      if (user.userImg) {
        await cloudinary.uploader.destroy(
          user.userImg.split("/").pop().split(".")[0]
        );
      }

      // save the image to cloudinary in both userImg and coverImg
      const uploadedResponse = await cloudinary.uploader.upload(userImg);
      userImg = uploadedResponse.secure_url;
    }
    // check if cover image is provided or not
    if (coverImg) {
      // delete the existing image from cloudinary
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      // upload the image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    // repplace the new value to older one

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.userImg = userImg || user.userImg;
    user.coverImg = coverImg || user.coverImg;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    user = await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    console.log("Error in updateUserProfile controller : ", err.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};
