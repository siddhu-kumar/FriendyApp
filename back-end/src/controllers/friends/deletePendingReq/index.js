


import { RequestSchema } from "../../../models/models.js";


export const deletePendingRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  console.log("rr", req.body);
  try {
    // const user = await RequestSchema.findOne({userId:requestId})
    const deletePendingRequest = await RequestSchema.findOneAndDelete({
      friendId: friendId,
    });
    console.log("11", deletePendingRequest);
    res.status(200).json({
      message: `Request has been deleted.`,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Request could not completed",
    });
  }
};