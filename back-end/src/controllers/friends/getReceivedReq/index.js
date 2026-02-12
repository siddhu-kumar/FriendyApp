import { RequestSchema } from "../../../models/models.js";
import { RequestSchemaUser } from "../../../class/usersSharedData.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { allUsers } from "../../../index.js";

export const getReceivedRequest = async (req, res) => {
  console.log("// get Received Request");
  const userId = req.userId;
  const receivedReqList = [];
  try {    
    const res3 = await pubClient.call("JSON.GET", `RECEIVED-${userId}`, "$");
    
    // console.log(res3)
    if(res3!==null && JSON.parse(res3)[0].length>0) {
      res.status(200).json(JSON.parse(res3)[0]);
      return;
    } else {

      // UserDetails (LogIN user) friend class instance & update received request list
      const receivedRequests = await RequestSchema.find({
        friendId: userId,
      });
      for (let element of receivedRequests) {
        // const data = await User.findOne({ id: element.userId });
      receivedReqList.push({
          userId:element.friendId,
          username:element.friendName,
          friendId:element.userId,
          friendname:element.name,
          friendImage:element.userImage.data?element.userImage.data.toString("base64"):null,
          contentType:element.userImage.contentType?element.userImage.contentType:null,
          createdAt:element.createdAt
      }
        );
        // console.log("received each", data.name, element);
      }
      
      const res2 = await pubClient.call("JSON.SET", `RECEIVED-${userId}`, "$", JSON.stringify(receivedReqList));
      console.log("received req list -", res2);
      res.status(200).json(receivedReqList);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
}