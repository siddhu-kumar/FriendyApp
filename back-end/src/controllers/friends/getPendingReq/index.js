

import {  RequestSchema } from "../../../models/models.js";


export const getSentRequest = async (req, res) => {
  console.log('// get Sent Request')
  const userId = req.userId;
  try {
    const sentRequest = await RequestSchema.find({
      userId: userId,
    });

    const result = sentRequest.map(doc => {
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