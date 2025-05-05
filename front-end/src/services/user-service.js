import {
    myAxios,
    privateAxios
} from './helper'

export const loginUser = (loginUser) => {
    console.log('login user', loginUser)
    return myAxios.post('/user/login', loginUser)
        .then((res) => {
            console.log(res.data)
            return res.data
        })
}

export const emailValidate = (data) => {
    return myAxios.post("/user/validate_email", data).then(res => res.data);
}

export const getAllUser = () => {
    return privateAxios.get('/user/all_user')
        .then(res => res.data)
}

export const getAllUserImages = () => {
    return privateAxios.post('/user/all_user/images')
        .then(res => res.data)
}

export const receivedRequest = () => {
    return privateAxios.get('/user/received_request')
        .then(res => res.data)
}

export const deletePendingRequest = (data) => {
    console.log(data)
    return privateAxios.delete('/user/delete_request', data).then(res => res.data)
}

export const pendingRequest = () => {
    return privateAxios.get('/user/pending_request')
        .then(res => res.data)
}

export const createRequest = (friend) => {
    console.log(friend)
    return privateAxios.post('/user/create_request', friend)
        .then(res => res.data)
}

export const acceptRequest = (friend) => {
    console.log()
    return privateAxios.post('/user/accept_request', friend)
        .then(res => res.data)
}

export const userProfile = (userData) => {
    return privateAxios.post(`/user/${userData}`)
        .then(res => res.data)
}

export const validateUserData = (userData) => {
    return myAxios.post(`/user/validate_data`, userData).then(res => res.data)
}

export const editProfile = (userData) => {
    return privateAxios.patch('/user/update', userData)
}

export const createUser = (userData) => {
    return myAxios.post('/user/register', userData).then(res => res.data)
}

export const userOTPValidate = (data) => {
    return myAxios.post('/user/validate_otp', data).then(res => res.data)
}

export const pagination = (data) => {
    return privateAxios.post('/user/pagination',data).then(res => res.data)
}

export const registerTempUser = (data) => {
    return myAxios.post('/user/register/temp',data).then(res => res.data);
}