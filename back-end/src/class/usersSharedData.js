
export class UserSharedData {
  constructor(userId, username, createdAt, userImage , contentType ) {
    this.userId = userId
    this.username = username
    this.userImage = userImage
    this.contentType = contentType
    this.createdAt = createdAt
  }
}

export class RequestSchemaUser {
  constructor(userId, username, friendId, friendname, friendImage, contentType, createdAt) {
    this.userId = userId
    this.username = username
    this.friendId = friendId
    this.friendname = friendname,
    this.friendImage = friendImage
    this.contentType = contentType
    this.createdAt = createdAt
  }
}