import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log('verifyToken',req.header)
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied!' })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, 'hello-world')
        req.userId = decoded.userId;
        // console.log(req.userId)
        next()
    } catch (err) {
        res.status(401).json({ error: 'Invalid token!' })
    }
}