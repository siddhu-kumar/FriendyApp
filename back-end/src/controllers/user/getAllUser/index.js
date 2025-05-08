

import { User, RequestSchema } from "../../../models/models.js";
import { status } from "../../../utils/error.js";
import { allUsers, } from "../../../index.js";
import { AllUsers } from "../../../class/userRespectiveData.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const getAllUser = async (req, res) => {
    console.log("// get all user");
    let friendId = [];
    const id = req.userId;
    friendId.push(id)
    try {
        const userData = await User.findOne({
            id: id,
        });


        // if (userData.image === null) {
        //     allUsers[id] = new AllUsers(id, userData.name, userData.email, userData.createdAt)
        // } else {
        //     allUsers[id] = new AllUsers(id, userData.name, userData.email, userData.createdAt, userData.image.data, userData.image.contentType)
        // }

        const requestList = await RequestSchema.find({
            $or: [
                { userId: id },
                { friendId: id }
            ]
        });

        for (let element of userData.friends) {
            friendId.push(element.friendId);
        }
        for (let element of requestList) {
            // received request to user
            friendId.push(element.friendId);
            // sent request by user
            friendId.push(element.userId);
        }
        
        const data = await User.find({
            id: {
                $nin: friendId,
            },
        }).sort({"createdAt":1}).limit(9);

       

        const result = data.map(doc => {
            const obj = doc.toObject();
            if (obj.image && obj.image.data) {
                obj.image.data = obj.image.data.toString("base64");
            }
            return obj;
        });

        for(let i=0; i<data.length;i++) {
            const obj = data[i].toObject();
            if(obj.image && obj.image.data ) {
                obj.image.data = obj.image.data.toString("base64");
            }
            data[i] = obj;
        }
    
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};