const token = localStorage.getItem('token')

const authHeader = {
    auth: {
        token: token
    }
}
const socket = io('http://127.0.0.1:8000', authHeader)
socket.on('message', (obj)=> {
    console.log(socket.id)
    document.querySelector('#myname').innerHTML = obj
    console.log('connected',obj)
})

let namespacesChat = []
let friendData = ""
let listener = false;


socket.on('adminNs',(endpoint)=> {
    if(!namespacesChat[token]){
        namespacesChat[token] = io(`http://127.0.0.1:8000${endpoint}`)
    }
    const list = document.getElementById("my-friends")
    list.innerHTML = ""
    namespacesChat[token].on('getFriendList',(friendList)=> {
        if(!listener){
            friendData = friendList;
            console.log('iiii',friendData)
            listener = true;
        }
    })
    console.log('namespace',namespacesChat[token])
    
    setTimeout(()=> {
        showFriend(friendData)
    },1000)

    namespacesChat[token].off('listenMessage');
    namespacesChat[token].on('listenMessage',(messageObj)=> {
        console.log(messageObj)
        document.getElementById('messages').innerHTML += `<li class="client">${messageObj.message}</li>`
    })
})
