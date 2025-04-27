


import { User } from "../../../models/models.js";

export const getFriends = async (req, res) => {
  console.log("// get particular user friends or connections");
  try {
    const userId = req.userId;
    const userData = await User.findById({
      _id: userId,
    });
    const friendsArray = [];
    for (const element of userData.friends) {
      const friendsData = await Friend.findById({
        _id: element,
      });
      const { _id, ...friendData } = friendsData.toObject();
      friendsArray.push(friendsData);
    }
    console.log(friendsArray);
    res.status(200).json(friendsArray);
  } catch (err) {
    console.log(err.errors);
    res.status(500).json({
      message: "Friends data could not fetched",
    });
  }
};