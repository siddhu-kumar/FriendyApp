

import { User, RequestSchema } from "../../../models/models.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const pagination = async (req, res) => {
    console.log("// pagination");
    const { cursor, pageSize } = req.body;
    console.log(cursor, pageSize);
    const id = req.userId;
    let data
    try {
        let friendId = []
        friendId.push(id);
        const userData = await User.findOne({id:id})

        for (let element of userData.friends) {
            friendId.push(element.friendId);
            console.log(element)
        }

        const requestList = await RequestSchema.find({
            $or: [
                { userId: id },
                { friendId: id }
            ]
        });
        for (let element of requestList) {
            // received request to user
            friendId.push(element.friendId);
            // sent request by user
            friendId.push(element.userId);
        }
        console.log(friendId)
        data = await User.find({
            id: {
                $nin: friendId
            },
            createdAt: { $gt: new Date(userData.createdAt) }
        }).sort({"createdAt":1}).limit(cursor+pageSize);
        // console.log('data', data)
        if(data.length<cursor+pageSize) {
            res.status(200).send(null);
            return;
        }
    } catch (err) {
        console.log('t',err)
    }
    res.status(200).send(data)
}