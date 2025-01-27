export class Namespace {
    constructor(userId,name,endpoint) {
        this.userId = userId,
        this.username = name,
        this.endpoint = endpoint,
        this.room = []
    }

    addRoom(roomObj) {
        this.room.push(roomObj)
    }
}