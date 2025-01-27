import { myAxios, privateAxios } from './helper'

export const loginUser = (loginUser) => {
    return myAxios.post('/user/login', loginUser)
    .then((res) => {
    return  res.data
    })
}

export const getAllUser = () => {
    return privateAxios.post('/user/all_user')
    .then(res => res.data)
}

export const userProfile = (userData) => {
    return privateAxios.post(`/user/${userData}`)
    .then(res=> res.data)
}

export const editProfile = (userData) => {
    return privateAxios.patch('/user/update',userData)
}

export const createUser = (userData) => {
    return myAxios.post('/user/register',userData).then(res=>res.data)
}