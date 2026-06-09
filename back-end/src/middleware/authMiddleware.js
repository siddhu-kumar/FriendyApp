// token validation for api routes

import jwt from "jsonwebtoken"

import { KEYS } from "../config/index.js";

export const verifyToken = (req, res, next) => {
    console.log("// verify token");
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        console.log("no access token")
        return res.status(401).json({
            error: 'No token provided!'
        })
    }
    try {
        const decoded = jwt.verify(accessToken, KEYS.secret_key)
        req.userId = decoded.userId;
        next()
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            return res.status(401).json({
                message: 'Token has Expired!'
            })
        }
        if(err.name == "JsonWebTokenError") {
            return res.status(401).json({
                message: 'Invalid token!'
            })
        }
        res.status(401).json({
            message: 'Authentication failed!'
        })
    }
}