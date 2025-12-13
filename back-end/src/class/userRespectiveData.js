export class LoginUser {
  constructor(userId, username, email = null, contact=null, createdAt, userImage = null, contentType = null, token) {
    // userId - This is ID of current user login friend
    this.userId = userId;
    // username - This is name of current user login friend
    this.username = username;
    this.email = email;
    this.contact = contact;
    this.createdAt = createdAt;
    // user Profile Image base64
    this.userImage = userImage;
    this.contentType = contentType;
    this.token = token
    }

}

export class UserDetails {
  constructor(userId, username, email = null, contact = null, createdAt, userImage = null, contentType = null, token) {
    // userId - This is ID of current user login friend
    this.userId = userId;
    // username - This is name of current user login friend
    this.username = username;
    this.email = email;
    this.contact = contact;
    this.createdAt = createdAt;
    // user Profile Image base64
    this.userImage = userImage;
    this.contentType = contentType;
    this.token = token;
    // unknown user list
    this.commonUserList = [];
    this.receivedReqList = [];
    this.sentReqList = [];
    this.friendList = []
  }

  addImage(userImage, contentType) {
    (this.userImage = userImage), (this.contentType = contentType);
  }

  addSentRequest(userObj) {
    this.sentReqList.push(userObj);
  }
  addReceivedRequest(userObj) {
    this.receivedReqList.push(userObj);
  }
  addGlobalRespectiveUser(userObj) {
    this.commonUserList.push(userObj);
  }
  addUserFriend(userObj) {
    this.friendList.push(userObj)
  }
}