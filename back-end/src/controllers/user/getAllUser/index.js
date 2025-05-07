import { User, RequestSchema, Image } from "../../../models/models.js";
import { status } from "../../../utils/error.js";
import { allUsers, tempImageData } from "../../../index.js";
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
        const userImage = await Image.findOne({
            id: id
        })

        if (userImage === null) {
            allUsers[id] = new AllUsers(id, userData.name, userData.email, userData.createdAt)
        } else {
            allUsers[id] = new AllUsers(id, userData.name, userData.email, userData.createdAt, userImage.image.data, userImage.image.contentType)
        }

        const requestList = await RequestSchema.find({
            $or: [
                { userId: id },
                { friendId: id }
            ]
        });
 
        // console.log(requestList)

        for (let element of userData.friends) {
            friendId.push(element.friendId);
        }
        for (let element of requestList) {
            // received request to user
            friendId.push(element.friendId);
            // sent request by user
            friendId.push(element.userId);
        }

        allUsers[id].addRequestedUserId(friendId)
        
        const data = await User.find({
            id: {
                $nin: friendId,
            },
        }).sort({"createdAt":1}).limit(9);

        // console.log('data',data)
        
        const imageData = await Image.find({ id: { $nin: friendId } });
        for (let element of imageData) {
            tempImageData[element.id] = element;
        }

        for (let element of requestList) {
            if (tempImageData[element.userId] && element.userId!==id) {
                const obj = new UserSharedData(
                    element.userId,
                    element.name,
                    element.email,
                    element.createdAt,
                    tempImageData[element.userId].image.data.toString("base64"),
                    tempImageData[element.userId].image.contentType
                )
                allUsers[id].addSentRequest(obj)
            } else if( element.userId!==id) {
                const obj = new UserSharedData(
                    element.userId,
                    element.name,
                    element.email,
                    element.createdAt,
                )
                allUsers[id].addReceivedRequest(obj)
            }

            if (tempImageData[element.friendId] && element.friendId!==id) {
                const obj = new UserSharedData(
                    element.userId,
                    element.friendName,
                    tempImageData[element.friendId].image.data.toString("base64"),
                    tempImageData[element.friendId].image.contentType
                )
                allUsers[id].addReceivedRequest(obj)
            } else if( element.friendId!==id) {
                const obj = new UserSharedData(
                    element.friendId,
                    element.friendName,
                )
                allUsers[id].addSentRequest(obj)
            }
        }

        // console.log('lists', allUsers[id].sentRequestList)
        // console.log('lists2', allUsers[id].receivedRequestList)

        for (let element of data) {
            if (tempImageData[element.id]) {
                const obj = new UserSharedData(
                    element.id,
                    element.name,
                    element.email,
                    element.createdAt,
                    tempImageData[element.id].image.data.toString("base64"),
                    tempImageData[element.id].image.contentType
                )
                allUsers[id].addGlobalRespectiveUser(obj)
            } else {
                const obj = new UserSharedData(
                    element.id,
                    element.name,
                    element.email,
                    element.createdAt
                )
                allUsers[id].addGlobalRespectiveUser(obj)
            }
        }


        res.status(status.OK).send(allUsers[id].globalUserList);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};