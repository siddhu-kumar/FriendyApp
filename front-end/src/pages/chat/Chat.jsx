import React, { useState } from "react";
import style from "./chat.module.css"
import { ShowFriend } from "./ShowFriend";
import { ChatBox } from "./ChatBox";

function Chat() {
  const [listClicked, setListClicked_] = useState('');
  const [friendData, setFriendData_] = useState('');
  const [chatHistory, setChatHistory_] = useState([])

  const getData = (friendData, chatHistory, listClicked) => {
    // console.log(friendData,chatHistory,listClicked)
    setListClicked_(listClicked)
    setChatHistory_(chatHistory)
    setFriendData_(friendData);
  }

  return (
    <>
      <div className={style.chat_page}>
        <ShowFriend getData={getData} />
        {listClicked && <ChatBox friendData={friendData} chatHistory={chatHistory} setChatHistory={setChatHistory_} />}

      </div>
    </>
  )
}

export default Chat;
