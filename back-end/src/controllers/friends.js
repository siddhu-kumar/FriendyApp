import { User, Chat, RequestSchema } from "../models/models.js";
import { generateRoomId } from "./chat.js";
import { namespace } from "../index.js";
import { Room } from "../class/Room.js";

export const getPendingRequest = async (req,res) => {
    const userId = req.userId;
    // console.log('enter')
    // console.log(userId)
    try {
        const pendingRequest =  await RequestSchema.find({userId:userId});
        // console.log(pendingRequest)
        res.status(200).json(pendingRequest)
    } catch(err) {
        console.log(err) 
        res.status(400).json({message:'Request could not completed'})
    }
}

export const getReceivedRequest = async(req,res) => {
    const userId = req.userId
    try {
        const receivedRequest = await RequestSchema.find({friendId:userId})
        console.log(receivedRequest)
        res.status(200).json(receivedRequest)
    } catch(err) {
        console.log(err) 
        res.status(400).json({message:'Request could not completed'})
    }
}

export const deletePendingRequest = async (req,res) => {
    const userId = req.userId
    const {friendId} = req.body
    console.log('rr',req.body)
    try {
        // const user = await RequestSchema.findOne({userId:requestId})
        const deletePendingRequest = await RequestSchema.findOneAndDelete({friendId:friendId})
        console.log('11', deletePendingRequest)
        res.status(200).json({message:`Request has been deleted.`})
    } catch(err) {
        console.log(err)
        res.status(404).json({message:'Request could not completed'})
    }
}

export const acceptRequest = async(req,res) => {
    const userId = req.userId;
    const {requestId} = req.body;
    console.log(userId, requestId)
    try {
        const userData = await User.findOne({id:userId})
        const friendData = await User.findOne({id:requestId})
        const roomId = generateRoomId(userData.id, friendData.id)
        const chat = new Chat({roomId: roomId})
        const chatData = await chat.save()
        const request = await RequestSchema.findOneAndDelete({userId:requestId})
        console.log(request)
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
        res.status(400).json({message:'request not completed'})
    }
}

export const createRequest = async (req, res) => {
    console.log('// create new friend')
    const {email} = req.body;
    const userId = req.userId;
    try {
        const userData = await User.findOne({ id: userId })
        const friendData = await User.findOne({email:email})
    
        console.log(userId,friendData)
        const request = new RequestSchema({userId:userId,name:userData.name,friendId:friendData.id,friendName:friendData.name})
        console.log('Request made')
        const r = await request.save();
        console.log(request, r)
        res.status(200).json({message:`Request has been sent to`})
 
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error on saving data' })
    }
}

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
        console.log('f',friend)
        
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