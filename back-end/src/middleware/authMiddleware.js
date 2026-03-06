// token validation for api routes

import jwt from "jsonwebtoken"

const secret_key = process.env.AUTH_SECRET_KEY

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
        const decoded = jwt.verify(accessToken, secret_key)
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