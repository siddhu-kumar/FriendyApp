import {
    myAxios
} from "./helper"

export const userEmailVerify = (data) => {
    console.log(data)
    return myAxios.post('/verify-email', data).then(res => res.data)
}

export const userOTPVerify = (data) => {
    return myAxios.post('/verify-otp', data).then(res => res.data)
}

export const userPasswordReset = (data) => {
    console.log(data)
    return myAxios.post('/reset-password', data).then(res => res.data)
}