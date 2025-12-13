import { RequestSchema } from "../../../models/models.js";
import { RequestSchemaUser } from "../../../class/usersSharedData.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { allUsers } from "../../../index.js";

export const getSentRequest = async (req, res) => {
  console.log("// get Sent Request");
  const userId = req.userId;
  const sentReqList = [];
  try {
    const res3 = await pubClient.call("JSON.GET", `SENT-${userId}`, ".");
    console.log("redis - get -", userId,),JSON.parse(res3);

    if (res3) {
      res.status(200).json(JSON.parse(res3));
      return;
    } else {
      // UserDetails (LogIN user) friend class instance & update sent request list
      const sentRequests = await RequestSchema.find({ userId: userId });
      for (let element of sentRequests) {
        sentReqList.push(
          new RequestSchemaUser(
            element.userId,
            element.name,
            element.friendId,
            element.friendName,
            element.friendImage.data.toString("base64"),
            element.friendImage.contentType,
            element.createdAt
          )
        );
      }
      const res2 = await pubClient.call("JSON.SET", `SENT-${userId}`, "$", JSON.stringify(sentReqList))
      console.log('sent req list - ',sentReqList)
      res.status(200).json(sentReqList);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};
