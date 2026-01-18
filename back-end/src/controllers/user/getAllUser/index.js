import { User, RequestSchema } from "../../../models/models.js";
import { status } from "../../../utils/error.js";
import { allUsers } from "../../../index.js";
import { UserDetails } from "../../../class/userRespectiveData.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const getAllUser = async (req, res) => {
  // list of reqeusts received or sent by a user
  let requestsListID = [];
  const id = req.userId;
  requestsListID.push(id);
  try {
    const userData = await User.findOne({
      id: id,
    });


    const requestList = await RequestSchema.find({
      $or: [
        {friendId: id},
        {userId: id}
      ]
    });

    // requestList.forEach((element) => {
    //   console.log(element);
    // });

    for (let element of userData.friends) {
      requestsListID.push(element.friendId);
    }
    for (let element of requestList) {
      // received request to user
      requestsListID.push(element.friendId);
      // sent request by user
      requestsListID.push(element.userId);
    }

    // console.log(requestsListID);

    const data = await User.find({
      id: {
        $nin: requestsListID,
      },
    })
      .sort({ createdAt: 1 })
      .limit(9);

    // console.log(data.length);

    const result = data.map((doc) => {
      const obj = doc.toObject();
      if (obj.image && obj.image.data) {
        obj.image.data = obj.image.data.toString("base64");
      }
      return obj;
    });

    for (let i = 0; i < data.length; i++) {
      const obj = data[i].toObject();
      if (obj.image && obj.image.data) {
        obj.image.data = obj.image.data.toString("base64");
      }
      data[i] = obj;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
