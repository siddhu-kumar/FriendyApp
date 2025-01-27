import { privateAxios } from "./helper"

export const getFriend = (id) => {
    console.log('working')
    return privateAxios.get(`/friend/${id}`)
        .then(res => res.data)
}

export const getConnections = () => {
    return privateAxios.get('/friend/')
        .then(res => res.data)
}

export const createFriend = (friend) => {
    console.log(friend)
    return privateAxios.post('/friend/', friend)
        .then(res => res.data)
}

export const editFriend = (friend_id) => {
    return privateAxios.patch('/friend/', friend_id)
        .then(res => res.data)
}

export const deleteFriend = (id) => {
    console.log(id)
    return privateAxios.delete(`/friend/${id}`)
        .then(res => res.data)
}