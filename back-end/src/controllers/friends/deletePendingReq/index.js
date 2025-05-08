
import { allUsers } from "../../../index.js";
import { RequestSchema } from "../../../models/models.js";

export const deleteSentRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  console.log("rr", req.body);
  try {
    const updatedSentReq = allUsers[userId].sentRequestList.filter(ele=>ele.userId !== friendId)
    allUsers[userId].sentRequestList = updatedSentReq
    console.log('updatedsentreq',updatedSentReq)
    const deleteSentRequest = await RequestSchema.findOneAndDelete({
      friendId: friendId,
    });
    console.log("11",deleteSentRequest);
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


export const deleteReceivedRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  console.log("rr", req.body);
  try {
      const deleteReceivedRequest = await RequestSchema.findOneAndDelete({
      friendId: friendId,
    });
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