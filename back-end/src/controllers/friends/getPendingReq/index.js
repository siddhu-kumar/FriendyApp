

import { Image, RequestSchema } from "../../../models/models.js";
import { UserSharedData } from "../../../class/usersSharedData.js";
import { allUsers } from "../../../index.js";


export const getSentRequest = async (req, res) => {
  const userId = req.userId;
  // console.log('enter')
  // console.log(userId)
  let userList = []
  try {
    const sentRequest = await RequestSchema.find({
      userId: userId,
    });
    
    for(let element of sentRequest) {
      userList.push(element.friendId);
    }

    const imageList = await Image.find({
      id: {$in:userList}
    })
    console.log('ll',allUsers[userId].sentRequestList)


    res.status(200).json(allUsers[userId].sentRequestList);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};