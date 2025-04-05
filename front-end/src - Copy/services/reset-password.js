import { myAxios } from "./helper"

export const emailVerify = (data) => {
    console.log(data)
    return myAxios.post('/verify-email',data).then(res=>res.data)
}

export const verifyOTP = (data) => {
    return myAxios.post('/verify-otp',data).then(res=>res.data)
}

export const resetPassword = (data) => {
    console.log(data)
    return myAxios.post('/reset-password',data).then(res=>res.data)
}