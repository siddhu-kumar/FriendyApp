import jwt from "jsonwebtoken"
import express from "express"

const secret_key = process.env.AUTH_SECRET_KEY

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log('verifyToken',req)
    if (!authHeader) {
        return res.status(401).json({
            error: 'Access denied!'
        })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret_key)
        req.userId = decoded.userId;
        // console.log(req.userId)
        next()
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            return res.status(401).json({
                expire: 'Token has Expired!'
            })
        }
        res.status(401).json({
            error: 'Invalid token!'
        })
    }
}