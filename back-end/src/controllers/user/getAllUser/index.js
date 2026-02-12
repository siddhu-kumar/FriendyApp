import { User, RequestSchema } from "../../../models/models.js";
import { status } from "../../../utils/error.js";
import { allUsers } from "../../../index.js";
import { UserDetails } from "../../../class/userRespectiveData.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const getAllUser = async (req, res) => {
  // list of reqeusts received or sent by a user
  console.log('// get all user list')
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

    const userList = await User.find({
      id: {
        $nin: requestsListID,
      },
    })
      .sort({ createdAt: 1 })
      .limit(9);

    // console.log(userList);
    let userHomePageList = []
    for(const data of userList) {
      const obj = new UserSharedData(data.id, data.name, data.createdAt, data.image.data?data.image.data:null, data.image.contentType?data.image.contentType:null)
      userHomePageList.push(obj);
    }

    // const result = userList.map((doc) => {
    //   const obj = doc.toObject();
    //   if (obj.image && obj.image.data) {
    //     obj.image.data = obj.image.data.toString("base64");
    //   }
    //   return obj;
    // });

    // for (let i = 0; i < userList.length; i++) {
    //   const obj = userList[i].toObject();
    //   if (obj.image && obj.image.data) {
    //     obj.image.data = obj.image.data.toString("base64");
    //   }
    //   userList[i] = obj;
    // }
    // console.log(userHomePageList)
    res.status(200).json(userHomePageList);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
