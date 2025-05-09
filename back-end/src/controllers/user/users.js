import crypto from "crypto";
import jwt from "jsonwebtoken";
import path from "path";
import bcrypt from "bcrypt";
import { RequestSchema, TempUser, User } from "../../models/models.js";
import { v4 as uuidv4 } from "uuid";
import { generateEndpoint } from "../chat.js";
import { namespace } from "../../index.js";
import { Namespace } from "../../class/Namespace.js";
import { status } from "../../utils/error.js";
import { totp } from "otplib";
import { sendEmail } from "../user_validate.js";
import { Image } from "../../models/models.js";
import { promises } from "fs";
import { fileURLToPath } from "url";

const secret_key = process.env.AUTH_SECRET_KEY;


// get all user
// export const getAllUser = async (req, res) => {
//     console.log("// get all user");
//     const id = req.userId;
//     console.log(id);
//     const friendId = [id];
//     try {
//         const friendList = await User.findOne({
//             id: id,
//         });
//         const requestList = await RequestSchema.find({
//             userId: id,
//         });
//         // check friends in friendList, not implemented
//         for (let element of friendList.friends) {
//             friendId.push(element.friendId);
//         }
//         console.log(requestList);
//         for (let element of requestList) {
//             friendId.push(element.friendId);
//         }
//         const data = await User.find({
//             id: {
//                 $nin: friendId,
//             },
//         });
//         res.status(status.OK).send(data);
//     } catch (err) {
//         console.log(err);
//         res.send(err.message);
//     }
// };

// get user data or profile
// export const getUser = async (req, res) => {
//     console.log("// get user data or profile");
//     try {
//         const id = req.userId;
//         console.log(id);
//         const data = await User.findOne({
//             id: id,
//         });
//         const { _id, friends, password, ...userData } = data.toObject();
//         res.status(200).json(userData);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: "Data has not fetched!!",
//         });
//     }
// };

// export const validateUserData = async (req, res) => {
//     console.log("called");
//     try {
//         const { name, email, contact, password } = req.body;
//         const doesExists = await User.findOne({
//             $or: [
//                 {
//                     contact: req.body.contact,
//                 },
//                 {
//                     email: req.body.email,
//                 },
//             ],
//         });
//         // const {contact, email } = doesExists.toObject();
//         console.log("is", doesExists);
//         if (doesExists === null) {
//             // flag = true, it allows to create new user
//             const hash = crypto.createHash("sha256");

//             hash.update(email + Math.random() * 100);
//             const sskey = hash.digest("hex");
//             totp.options = {
//                 step: 1000,
//             };
//             const otp = totp.generate(sskey);
//             console.log(otp);
//             const tempUser = new TempUser({
//                 name: name,
//                 email: email,
//                 contact: contact,
//                 sskey: sskey,
//                 otp: otp,
//                 password: password,
//             });
//             await tempUser.save();
//             await sendEmail(email, otp);
//             res.status(200).json({
//                 message: "doesNotExists",
//                 flag: true,
//             });

//             return;
//         }
//         // flag = false, it dose not allow to create new user
//         res.status(400).json({
//             message: "doesExists",
//             flag: false,
//         });
//         return;
//     } catch (error) {
//         console.log(error);
//     }
// };



// creating new user
// export const createUser = async (otp, res) => {
//     console.log("// creating new user");
//     try {
//         const getUser = await TempUser.findOne({
//             otp,
//         });

//         const { name, email, contact, password } = getUser.toObject();
//         // console.log(req.body)
//         // const doesExists = await User.findOne({contact:req.body.contact,email:req.body.email});
//         // if(doesExists !== null) {
//         //     res.status(409).json({message:'user already exists!'})
//         //     return;
//         // }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log("h", hashedPassword);
//         const endPoint = await generateEndpoint(contact);
//         const uuid = uuidv4();
//         console.log(uuid);
//         try {
//             const newUser = new User({
//                 id: uuid,
//                 name: name,
//                 email: email,
//                 contact: contact,
//                 endpoint: endPoint,
//                 password: hashedPassword,
//             });
//             const defaultImage = new Image({
//                 id: uuid,
//                 image: {
//                     data: readFile,
//                     contentType: "image/png",
//                 },
//             });
//             await defaultImage.save();
//             const saveUser = await newUser.save();
//             console.log(saveUser);
//         } catch (error) {
//             console.log("ct", error);
//             if (error.code === 11000) {
//                 if (error.keyValue.email) {
//                     console.log("Email already exists");
//                     res.status(400).json({
//                         message: error.keyValue.email,
//                         isValid: false,
//                         object: "mail",
//                     });
//                     return;
//                 }
//                 if (error.keyValue.contact) {
//                     console.log("Contact already exists");
//                     res.status(400).json({
//                         message: error.keyValue.contact,
//                         isValid: false,
//                         object: "contact",
//                     });
//                     return;
//                 }
//             }
//         }
//         namespace[uuid] = new Namespace(uuid, name, endPoint);

//         const token = jwt.sign(
//             {
//                 userId: uuid,
//             },
//             secret_key,
//             {
//                 expiresIn: "100h",
//             }
//         );
//         const data = {
//             name,
//             email,
//             contact,
//         };

//         res.status(status.CREATED).json({
//             data,
//             token,
//         });
//         const deleteTempUser = await TempUser.findOneAndDelete({
//             otp: otp,
//         });
//         console.log(deleteTempUser);
//     } catch (error) {
//         console.log("c", error.errors);
//         if (error.code === 11000) {
//             // Extract the field that caused the duplicate key error
//             const duplicateField = Object.keys(error.keyValue)[0];
//             const duplicateValue = error.keyValue[duplicateField];
//             console.log(
//                 `Duplicate key error on field: ${duplicateField} with value: ${duplicateValue}`
//             );
//         }
//         if (error.code === 11000) {
//             if (error.keyValue.email) {
//                 console.log("Email already exists");
//                 return res.status(400).json({
//                     message: `Email already exists: ${error.keyValue.email}`,
//                 });
//             }
//             if (error.keyValue.contact) {
//                 console.log("Contact already exists");
//                 return res.status(400).json({
//                     message: `Contact already exists: ${error.keyValue.contact}`,
//                 });
//             }
//         }
//         res.status(500).json({
//             message: "Sorry it's us!!",
//         });
//     }
// };

// login user


// export const loginUser = async (req, res) => {
//     console.log("// login user");
//     try {
//         const { email, user_password } = req.body;
//         // console.log(email, user_password)
//         const userData = await User.findOne({
//             email,
//         });
//         // console.log(userData)
//         if (!userData) {
//             console.log("user does not exists");
//             return res.status(401).json({
//                 message: "User/Password does not exists!",
//             });
//         }
//         const passwordMatch = await bcrypt.compare(
//             user_password,
//             userData.password
//         );
//         if (!passwordMatch) {
//             console.log("Login failed!");
//             return res.status(401).json({
//                 message: "User/Password does not exists!",
//             });
//         }
//         const { _id, password, friends, ...data } = userData.toObject();
//         let imageObj;
//         try {
//             const { image } = await Image.findOne({
//                 id: data.id,
//             });
//             if (image !== null) {
//                 console.log("image", image.contentType);
//                 imageObj = {
//                     image: image.data.toString("base64"),
//                     contentType: image.contentType,
//                 }; // Convert binary to Base64
//             }
//         } catch (error) {
//             console.log("w", error.errors);
//         }
//         const token = jwt.sign(
//             {
//                 userId: userData.id,
//             },
//             secret_key,
//             {
//                 expiresIn: "100h",
//             }
//         );
//         namespace[userData.id] = new Namespace(
//             userData.id,
//             userData.name,
//             userData.endpoint
//         );
//         console.log("namspace", namespace);
//         res.status(200).json({
//             data,
//             token,
//             imageObj,
//         });
//     } catch (error) {
//         console.log("e", error.errors);
//         res.status(500).json({
//             message: "Login Failed",
//         });
//     }
// };

// update user profile
export const updateUser = async (req, res) => {
    console.log("// update user profile");
    const userId = req.userId;
    console.log(userId, req.body);
    try {
        const userData = await User.findOneAndUpdate(
            {
                id: userId,
            },
            req.body,
            {
                new: true,
            }
        );
        const { name, contact, email } = userData.toObject();
        const data = {
            name: name,
            contact: contact,
            email: email,
        };
        res.status(201).json(data);
    } catch (err) {
        console.log(err.errors);
        res.status(500).json({
            message: "Error updating user",
        });
    }
};

// update profile image
export const updateProfile = async (req, res) => {
    try {
        const objImage = await Image.findOne({
            id: req.userId,
        });
        //   console.log('req',req.userId)
        if (objImage === null) {
            const objImage = new Image({
                id: req.userId,
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                },
            });
            await objImage.save();
            // console.log('obj',objImage)
        } else {
            objImage.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
            await objImage.save();
        }
        res.status(200).json({
            message: "Hii",
        });
        return;
    } catch (err) {
        console.error("er", err);
        res.status(401).json({
            message: "Not",
        });
        return;
    }
};
