import jwt from "jsonwebtoken"

const secret_key = process.env.AUTH_SECRET_KEY

export const authToken = (token) => {
    token = token.split(" ")[1]
    console.log('auth token',token)
    try {
        const decoded = jwt.verify(token, secret_key)
        console.log('verified',decoded)
        return decoded.userId
    } catch (err) {
        if(err.name == "TokenExpiredError") {
            console.log('got it')
        }
        console.log('err',err)
        return { error: 'Invalid token!' }
    }
}