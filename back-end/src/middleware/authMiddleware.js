import jwt from "jsonwebtoken"
import express from "express"
export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log('verifyToken',req)
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied!' })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, 'hello-world')
        console.log(decoded)
        req.userId = decoded.userId;
        console.log(req.userId)
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Invalid token!' })
    }
}