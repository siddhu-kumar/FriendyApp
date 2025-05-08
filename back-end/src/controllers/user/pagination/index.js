

import { User, RequestSchema } from "../../../models/models.js";
import { allUsers, } from "../../../index.js";
import { AllUsers } from "../../../class/userRespectiveData.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const pagination = async (req, res) => {
    console.log("// pagination");
    const { cursor, pageSize } = req.body;
    console.log(cursor, pageSize);
    const id = req.userId;
    const totalLength = allUsers[id].globalUserList.length;

    try {
        const created = allUsers[id].globalUserList[totalLength - 1].createdAt;
        console.log(allUsers[id].receivedRequestList)
        const data = await User.find({
            id: {
                $nin: allUsers[id].requestsList,
            },
            createdAt: { $gt: new Date(created) }
        }).sort({"createdAt":1}).limit(5);
        // console.log('data', data)
        for (let element of data) {

            const obj = new UserSharedData(
                element.id,
                element.name,
                element.email,
                element.createdAt
            )
            allUsers[id].addGlobalRespectiveUser(obj)
        }
    } catch (err) {
        console.log('t',err)
    }
    res.status(200).send(allUsers[id].globalUserList.slice(totalLength, totalLength + 5))
}