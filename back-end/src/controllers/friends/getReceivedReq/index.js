

import { RequestSchema } from "../../../models/models.js";


export const getReceivedRequest = async (req, res) => {
  console.log('// get Received Request')
  const userId = req.userId;
  try {
    const receivedRequest = await RequestSchema.find({
      friendId: userId,
    });
    console.log(receivedRequest);
    const result = receivedRequest.map(doc => {
      const obj = doc.toObject();
      if(obj.friendImage && obj.friendImage.data) {
        obj.friendImage.data = obj.friendImage.data.toString("base64");
      }
      return obj;
    })
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};