
import { User, } from "../../../models/models.js";
import { Namespace } from "../../../class/Namespace.js";
import { namespace } from "../../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const secret_key = process.env.AUTH_SECRET_KEY;


export const loginUser = async (req, res) => {
    console.log("// login user");
    try {
        const { email, user_password } = req.body;
        // console.log(email, user_password)
        const userData = await User.findOne({
            email,
        });
        // console.log(userData)
        if (!userData) {
            console.log("user does not exists");
            return res.status(401).json({
                message: "User/Password does not exists!",
            });
        }
        const passwordMatch = await bcrypt.compare(
            user_password,
            userData.password
        );
        if (!passwordMatch) {
            console.log("Login failed!");
            return res.status(401).json({
                message: "User/Password does not exists!",
            });
        }
        console.log(email,passwordMatch)
        const { _id, password, friends, ...data } = userData.toObject();
        let imageObj;
        try {
            if (userData.image.data !== null) {
                // console.log("image", user.contentType);
                imageObj = {
                    image: userData.image.data.toString("base64"),
                    contentType: userData.image.contentType,
                }; // Convert binary to Base64
                console.log(imageObj.image)
            } else {
                imageObj = {
                    image: null,
                    contentType: null,
                }
            }
        } catch (error) {
            console.log("w", error);
        }
        const token = jwt.sign(
            {
                userId: userData.id,
            },
            secret_key,
            {
                expiresIn: "100h",
            }
        );
        namespace[userData.id] = new Namespace(
            userData.id,
            userData.name,
            userData.endpoint
        );
        console.log("namspace", namespace);
        res.status(200).json({
            data,
            token,
        });
    } catch (error) {
        console.log("e", error);
        res.status(500).json({
            message: "Login Failed",
        });
    }
};