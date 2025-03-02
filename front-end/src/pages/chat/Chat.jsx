import React, { useContext, useState, useEffect } from "react";
import style from "./chat.module.css"
import { ShowFriend } from "./ShowFriend";
import { ChatBox } from "./ChatBox";
import { ChatContext } from "../../context/chatContext";

function Chat() {
  const [listClicked, setListClicked] = useState('');
  const [friendData, setFriendData] = useState('');
  const [chatHistory, setChatHistory] = useState([])

  const getData = (friendData,chatHistory,listClicked) => {
    console.log(friendData,chatHistory,listClicked)
    setListClicked(listClicked)
    setChatHistory(chatHistory)
    setFriendData(friendData);
  }

  return (
    <>
      <div className={style.chat_page}>
        <ShowFriend getData={getData} />
        {listClicked && <ChatBox  friendData={friendData} chatHistory={chatHistory} setChatHistory={setChatHistory} />}

      </div>
    </>
  )
}

export default Chat;
