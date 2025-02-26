function chatForm(e,data) {
    e.preventDefault()
    data = JSON.parse(data)
    console.log(data)

    const message = document.forms["socket"]["message"].value;
    const messageObj = {
        message,
        date: Date.now(),
        sender: data.namespaceId,
        receiver: data.roomId
    }

    console.log(messageObj)

    namespacesChat[token].emit('newMessageToRoom',messageObj)

    document.forms["socket"]["message"].value = ""
    document.getElementById('message').innerHTML = ''
    
    document.getElementById("messages").innerHTML += `<li class="user">${message}</li>`
}