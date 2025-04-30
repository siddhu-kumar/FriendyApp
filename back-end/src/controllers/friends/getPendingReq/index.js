

import { Image, RequestSchema } from "../../../models/models.js";
import { UserSharedData } from "../../../class/usersSharedData.js";


export const getPendingRequest = async (req, res) => {
  const userId = req.userId;
  // console.log('enter')
  // console.log(userId)
  let userList = []
  try {
    const pendingRequest = await RequestSchema.find({
      userId: userId,
    });
    
    for(let element of pendingRequest) {
      userList.push(element.friendId);
    }

    const imageList = await Image.find({
      id: {$in:userList}
    })
    // console.log('ll',imageList)


    res.status(200).json(pendingRequest);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};