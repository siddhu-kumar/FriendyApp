import React, { useContext, useEffect, useState, } from "react";
import style from "./chat.module.css"
import { ChatBox } from "./ChatBox";
import { ChatContext } from "../../context/chatContext";
export const ShowFriend = () => {
  const {friendList, namespace, endPoint} = useContext(ChatContext)
  
  const [listclicked, setlistclicked] = useState('');
  const [friendData, setFriendData] = useState('');
  const [chatHistory,setChatHistory] = useState([])

  useEffect(() => {
    if (friendList.length !== 0)
      friendList.forEach(element => {
        console.log(element.name)
      });
    console.log('hii',friendList)
  }, [friendList])

  const handleClick = (event, friendData) => {
    // console.log(friendData, event)
    if (listclicked && listclicked !== event.currentTarget) {
      listclicked.style.backgroundColor = '';
    }
    namespace[endPoint].emit('joinsRoom', friendData, (val, err) => {
      if (val) {
        console.log('room', val)
      } else {
        console.log(err)
      }
    })
    setFriendData(friendData)
    event.currentTarget.style.backgroundColor = 'purple';
    setlistclicked(event.currentTarget)

    namespace[endPoint].on(friendData.roomId, (data) => {
      console.log(data)
      setChatHistory(data)
    })
  }
  return <div className={style.my_friends}>
    <ul>
      {
        friendList.length !== 0 ? friendList.map((data, index) => (
          // List on click call the friendFunction() to get into Chat with friend by passing _id of friend as argument
          <li onClick={(e) => handleClick(e, data)} key={index} className={style.frnd_class}>
            <img className={style.frnd_profile_img}  alt="" />
            <span className={style.frnd_name}>{data.username}</span>
            <span className={style.recent_msg_time}>{}</span>
            <span className={style.frnd_recent_msg}></span>
          </li>

        ))
          : '<>No Friend</>'
      }
    </ul>
    <div className={style.chatbox}>
      {listclicked && <ChatBox  friendData={friendData} chatHistory={chatHistory} setChatHistory={setChatHistory} />}
    </div>
  </div>;
};
