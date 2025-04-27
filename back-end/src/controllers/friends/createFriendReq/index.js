
import { User, RequestSchema } from "../../../models/models.js";

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { email } = req.body;
  const userId = req.userId;
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
    console.log("Request made");
    const r = await request.save();
    console.log(request, r);
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