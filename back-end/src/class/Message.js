export class Message {
    constructor(sender, receiver, date, message, roomId) {
        this.sender = sender
        this.receiver = receiver
        this.time = date
        this.message = message
        this.roomId = roomId
    }
}