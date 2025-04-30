
export class AllUsers {
  constructor( userId, username,email=null, userImage = null, contentType = null ) {
      // userId - This is ID of current user login friend
      this.userId = userId
      // username - This is name of current user login friend
      this.username = username
      this.email = email
      // user Profile Image
      this.userImage = userImage
      this.contentType = contentType
      this.globalUserList = []
      this.sentRequestList = []
      this.receivedRequestList = []
  }

  addImage(userImage, contentType) {
    this.userImage = userImage,
    this.contentType = contentType
  }

  addSentRequest(userObj) {
    this.sentRequestList.push(userObj)
  }
  addReceivedRequest(userObj) {
    this.receivedRequestList.push(userObj)
  }
  globalUserAdd(userObj) {
    this.globalUserList.push(userObj)
  }
}