
import { User, RequestSchema } from "../../../models/models.js";
import { allUsers } from "../../../index.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { email } = req.body;
  const userId = req.userId;
  console.log(userId, email)
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      email: email,
    });

    console.log(userId, friendData);
    const request = new RequestSchema({
      userId: userId,
      name: userData.name,
      friendId: friendData.id,
      friendName: friendData.name,
    });
    allUsers[userId].sentRequestList.push(new UserSharedData(friendData.id, friendData.name, friendData.email, friendData.createdAt));
    console.log("Request made",allUsers[userId].sentRequestList);
    const r = await request.save();
    console.log('r',request, r);
    res.status(200).json({
      message: `Request has been sent to`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error on saving data",
    });
  }
};