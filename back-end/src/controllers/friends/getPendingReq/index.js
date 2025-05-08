

<<<<<<< HEAD
import {  RequestSchema } from "../../../models/models.js";


export const getSentRequest = async (req, res) => {
  console.log('// get Sent Request')
  const userId = req.userId;
=======
import { Image, RequestSchema } from "../../../models/models.js";
import { UserSharedData } from "../../../class/usersSharedData.js";


export const getSentRequest = async (req, res) => {
  const userId = req.userId;
  // console.log('enter')
  // console.log(userId)
  let userList = []
>>>>>>> 84408644e3c9dfd747a837614043f05f339625bc
  try {
    const sentRequest = await RequestSchema.find({
      userId: userId,
    });
<<<<<<< HEAD

    const result = sentRequest.map(doc => {
      const obj = doc.toObject();
      if(obj.friendImage && obj.friendImage.data) {
        obj.friendImage.data = obj.friendImage.data.toString("base64");
      }
      return obj;
    })
    res.status(200).json(result);
=======
    
    for(let element of sentRequest) {
      userList.push(element.friendId);
    }

    const imageList = await Image.find({
      id: {$in:userList}
    })
    console.log('ll',imageList)

    
    res.status(200).json(sentRequest);
>>>>>>> 84408644e3c9dfd747a837614043f05f339625bc
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};