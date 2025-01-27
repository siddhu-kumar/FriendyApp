import jwt from "jsonwebtoken"

export const authToken = (token) => {
    try {
        const decoded = jwt.verify(token, 'hello-world')
        return decoded.userId
    } catch (err) {
        return ({ error: 'Invalid token!' })
    }
}