


export class UserSharedData {
  constructor( userId, username, email=null, createdAt, userImage = null,  contentType = null ) {
    // userId - This is ID of current user login friend
    this.userId = userId
    // username - This is name of current user login friend
    this.username = username
    this.email = email
    // user Profile Image
    this.userImage = userImage
    this.contentType = contentType
    this.createdAt = createdAt
  }
}