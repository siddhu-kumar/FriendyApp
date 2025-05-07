

export class AllUsers {
  constructor( userId, username,email=null,createdAt, userImage = null, contentType = null ) {
      // userId - This is ID of current user login friend
      this.userId = userId
      // username - This is name of current user login friend
      this.username = username
      this.email = email
      this.createdAt = createdAt
      // user Profile Image
      this.userImage = userImage
      this.contentType = contentType
      this.globalUserList = []
      this.requestsList = null
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
  addGlobalRespectiveUser(userObj) {
    this.globalUserList.push(userObj)
  }
  addRequestedUserId(userList) {
    this.requestsList = JSON.parse(JSON.stringify(userList))
    // this.requestsList.push(userObj)
  }
}