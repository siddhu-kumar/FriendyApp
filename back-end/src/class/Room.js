// class Room - It will store the data of single friend with main user(current login user)

export class Room {
    constructor(roomId, namespaceId, namespaceEndpoint, userId, username, userImage = null, contentType = null, userEndpoint, recentMessage, messageLength = 0, privateRoom = true, ) {
        // roomId - It is chatId of chat collection which stores chat details between two user.
        this.roomId = roomId;
        // namespaceId - It is ID of user who is login currently.
        this.namespaceId = namespaceId;
        // namespaceEndpoint - It is endpoint of user who is login currently.
        this.namespaceEndpoint = namespaceEndpoint
        // userId - This is ID of current user login friend
        this.userId = userId
        // username - This is name of current user login friend
        this.username = username
        // user Profile Image
        this.userImage = userImage
        this.contentType = contentType
        // userEndpoint - This is endpoint of current user login friend
        this.userEndpoint = userEndpoint
        this.privateRoom = privateRoom;
        // recentMessage - last sent or received message
        this.recentMessage = recentMessage;
        // It is chat data between two user, current login user and his friend
        this.history = []
        // Length of message to be sent
        this.messageLength = messageLength
    }
    // It is method to add chat data
    addMessage(messageObj) {
        this.history.push(messageObj);
    }

    clearHistory() {
        this.history = [];
    }
}