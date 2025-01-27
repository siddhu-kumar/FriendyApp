import { User, Chat } from "../models/models.js";
import { generateRoomId } from "./chat.js";
import { namespace } from "../index.js";
import { Room } from "../class/Room.js";
// create new friend
export const createFriend = async (req, res) => {
    console.log('// create new friend')
    const {email} = req.body;
    const userId = req.userId
    try {
        const userData = await User.findOne({ id: userId })
        const friendData = await User.findOne({email:email})
        const roomId = generateRoomId(userData.id, friendData.id)
        const chat = new Chat({roomId: roomId})
        const chatData = await chat.save()
        // console.log(chatData)
        const f = friendData.friends.push({friendId:userData.id,chatId:chatData.roomId})
        const u = userData.friends.push({friendId:friendData.id,chatId:chatData.roomId})
        const updateuser = await userData.save()
        const updatefriend = await friendData.save()
        // console.log(updateuser,updatefriend)
        const friend = await User.findOne({ "friends.friendId": userId }, { "friends.$": 1 });
        console.log(namespace[userData.id])
        
        namespace[userData.id].addRoom(new Room(roomId,userId,userData.endpoint,friendData.id,friendData.name,friendData.endpoint))
        
        res.status(201).json({message:'friend added'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error on saving data' })
    }
}

// get single friend
export const getFriendById = async (req, res) => {
    console.log('// get single friend')
    const { id } = req.params;
    try {
        const friend = await Friend.findById({ _id: id })
        console.log(friend.toObject())
        res.status(200).json(friend)
    } catch (err) {
        console.log(err.errors)
        res.status(500).json({ message: 'The Friend not Found' })
    }
}

// get particular user friends or connections
export const getFriends = async (req, res) => {
    console.log('// get particular user friends or connections')
    try {
        const userId = req.userId;
        const userData = await User.findById({ _id: userId })
        const friendsArray = []
        for (const element of userData.friends) {
            const friendsData = await Friend.findById({ _id: element })
            const { _id, ...friendData } = friendsData.toObject()
            friendsArray.push(friendsData)
        }
        console.log(friendsArray)
        res.status(200).json(friendsArray)
    } catch (err) {
        console.log(err.errors)
        res.status(500).json({ message: 'Friends data could not fetched' })
    }
}

// deletes the friend
export const deleteFriend = async (req, res) => {
    console.log('// deletes the friend')
    const { id } = req.params;
    const userId = req.userId;
    console.log(req.body)
    try {
        const userData = await User.findByIdAndUpdate( userId , { $pull: { friends: id } }, { new: true })
        const deleteFriend = await Friend.findByIdAndDelete(userId)
        const friendArray = userData.friends;
        console.log(friendArray)
        res.status(204).json(deleteFriend)
    } catch (err) {
        console.log(err.errors)
        res.status(500).json({ message: 'Error on deleting' })
    }
}