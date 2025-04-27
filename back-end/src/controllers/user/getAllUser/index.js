import { User, RequestSchema } from "../../../models/models.js";
import { status } from "../../../utils/error.js";

export const getAllUser = async (req, res) => {
    console.log("// get all user");
    const id = req.userId;
    // console.log(id);
    const friendId = [id];
    try {
        const friendList = await User.findOne({
            id: id,
        });
        const requestList = await RequestSchema.find({
            userId: id,
        });
        const receivedList = await RequestSchema.find({
            friendId: id,
        });
        // console.log('rdl',receivedList)
        // check friends in friendList, not implemented
        for (let element of friendList.friends) {
            friendId.push(element.friendId);
        }
        // console.log('rl',requestList);
        for (let element of requestList) {
            friendId.push(element.friendId);
        }
        for (let element of receivedList) {
            console.log(element)
            friendId.push(element.userId);
        }
        const data = await User.find({
            id: {
                $nin: friendId,
            },
        });
        res.status(status.OK).send(data);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};