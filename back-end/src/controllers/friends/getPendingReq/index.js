

import { RequestSchema } from "../../../models/models.js";



export const getPendingRequest = async (req, res) => {
  const userId = req.userId;
  // console.log('enter')
  // console.log(userId)
  try {
    const pendingRequest = await RequestSchema.find({
      userId: userId,
    });
    // console.log(pendingRequest)
    res.status(200).json(pendingRequest);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Request could not completed",
    });
  }
};