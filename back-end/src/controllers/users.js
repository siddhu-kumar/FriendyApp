import { RequestSchema, User } from "../models/models.js"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { generateEndpoint } from "./chat.js"
import { namespace } from "../index.js"
import { Namespace } from "../class/Namespace.js"

// get all user
export const getAllUser = async (req, res) => {
    console.log('// get all user')
    const id = req.userId
    console.log(id)
    const friendId = [id]
    try {
        const friendList = await User.findOne({id:id})
        const requestList = await RequestSchema.find({userId:id})
        for(let element of friendList.friends){
            friendId.push(element.friendId)
        }
        // console.log(requestList)
        for(let element of requestList) {
            friendId.push(element.friendId)
        }
        const data = await User.find({id:{$nin:friendId}})
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}

// get user data or profile
export const getUser = async (req, res) => {
    console.log('// get user data or profile')
    try {
        const id = req.userId;
        console.log(id)
        const data = await User.findOne({ id: id })
        const { _id, friends, password, ...userData } = data.toObject();
        res.status(200).json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Data has not fetched!!' })
    }
}

// creating new user
export const createUser = async (req, res) => {
    console.log('// creating new user')
    try {

        const {name, email, contact, password } = req.body;
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(password, 10)
        const endPoint = await generateEndpoint(contact)
        const id = uuidv4()
        console.log(id)
        const newUser = new User({id: id, name: name, email: email, contact: contact,endpoint:endPoint, password: hashedPassword });
        const saveUser = await newUser.save();
        namespace[id] = new Namespace(id,name,endPoint)

        const token = jwt.sign({ userId: id }, 'hello-world', { expiresIn: '100h' })
        const data = {name, email, contact }
        res.status(201).json({ data, token });
    } catch (error) {
        console.log('this is err', error)
        // if(Object.keys(error.errors)[0] === 'contact') {
        //     console.log('contact exits')
        //     res.status(400).json({message:'Contact already exists'})
        //     return;
        // }
        // if(Object.keys(error.errors)[0] === 'email') {
        //     console.log('email exits')
        //     res.status(400).json({message:'Email already registerd'})
        //     return;
        // }
        res.status(500).json({message:"Sorry it's us!!"})
    }
}

// login user
export const loginUser = async (req, res) => {
    console.log('// login user')
    try {
        const { email, user_password } = req.body;
        console.log(email, user_password)
        const userData = await User.findOne({ email })
        if (!userData) {
            console.log('user does not exists')
            return res.status(401).json({ message: 'User does not exists!' })
        }
        const passwordMatch = await bcrypt.compare(user_password, userData.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed!' })
        }
        const { _id, password, friends, ...data } = userData.toObject()
        console.log(data)
        const token = jwt.sign({ userId: userData.id }, 'hello-world', { expiresIn: '24h' })
        namespace[userData.id] = new Namespace(userData.id,userData.name,userData.endpoint)
        console.log(namespace)
        res.status(200).json({ data, token })
    } catch (error) {
        console.log(error.errors)
        res.status(500).json({ message: 'Login Failed' })
    }
}

// update user profile
export const updateUser = async (req, res) => {
    console.log('// update user profile')
    const userId = req.userId;
    console.log(userId, req.body)
    try {
        const userData = await User.findOneAndUpdate({ id: userId }, req.body, { new: true })
        const { name, contact, email } = userData.toObject();
        const data = { name: name, contact: contact, email: email}
        res.status(201).json(data)
    } catch (err) {
        console.log(err.errors)
        res.status(500).json({ message: 'Error updating user' })
    }
}
