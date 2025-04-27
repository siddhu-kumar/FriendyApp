

import { RequestSchema } from "../../../models/models.js";


export const getReceivedRequest = async (req, res) => {
  const userId = req.userId;
  try {
    const receivedRequest = await RequestSchema.find({
      friendId: userId,
    });
    console.log(receivedRequest);
    res.status(200).json(receivedRequest);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};