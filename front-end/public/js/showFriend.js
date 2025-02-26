
let listclicked = null; 

function friendFunction(dataString) {
    const data = JSON.parse(dataString)

    namespacesChat[token].emit('joinsRoom',data,(err,val)=> {
        if(err) {
            console.log('room',err)
        } else {
           console.log(val)
        }
    })
    
    namespacesChat[token].on(data.roomTitle,(histroy)=> {
        // console.log(data.roomTitle)
        console.log(histroy)
        const messageHistory = document.querySelector('#messages');
        messageHistory.innerHTML = "";  
        if(histroy.length !== 0)
            histroy.forEach(data => {
                // console.log(data)
                if(data.sender==token)
                    messageHistory.innerHTML += `<li class="user">${data.message}</li>`
                else  
                    messageHistory.innerHTML += `<li class="client">${data.message}</li>`

            })
    })

    document.getElementById('chat').innerHTML = `
    <div id="messages"></div>
    <form class="chat-forms" name="socket" >

        <input class="chat-input" id="message" name="message" placeholder="Message" type="text">
        <button class="send-chat chat-button" type="submit">Send</button>
    </form>
    `;
    const form = document.querySelector('.chat-forms');
    form.addEventListener('submit', function(event) {
        chatForm(event, dataString);  // Pass the event and the data
    });
}

const showFriend = (friendData) => {
    let list = document.querySelector('#my-friends')
    list.innerHTML = ""
    friendData.forEach((data) => {
        const dataString = JSON.stringify(data)
        // List on click call the friendFunction() to get into Chat with friend by passing _id of friend as argument
        list.innerHTML += `
        <li onclick=handleClick('${dataString}',event) class="frnd-class">
            <img class="frnd-profile-img" src="" alt="">
            <span class="frnd-name">${data.name}</span>
            <span class="recent-msg-time"></span>
            <span class="frnd-recent-msg"></span>
        </li>
        `
    });
}

const handleClick = (friendData, event) => {
    console.log(friendData, event)
    // check and Reset the background of the previous item
    if (listclicked && listclicked !== event.currentTarget) {
        listclicked.style.backgroundColor = ''; 
    }

    // Change background color of the clicked item
    event.currentTarget.style.backgroundColor = 'purple'; 

    // Update the reference to the currently clicked item
    listclicked = event.currentTarget;

    friendFunction(friendData);
}