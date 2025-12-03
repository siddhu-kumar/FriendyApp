export class Message {
    constructor(sender, receiver, date, message, roomId) {
        this.sender = sender
        this.receiver = receiver
        this.date = date
        this.message = message
        this.roomId = roomId
    }
}