import React, { useContext, useEffect, useState } from "react";
import style from "./chat.module.css";
import { ChatContext } from "../../context/chatContext";

export const ShowFriend = (props) => {
  const { friendList, namespace, endPoint } = useContext(ChatContext);
  const [listClicked, setListClicked] = useState("");
  const [friendData, setFriendData] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    props.getData(friendData, chatHistory, listClicked);
  }, [chatHistory]);

  const handleClick = (event, friendData) => {
    event.preventDefault();
    // console.log('show ',friendData)
    if (listClicked && listClicked !== event.currentTarget) {
      // console.log(listClicked)
      listClicked.style.backgroundColor = "";
    }
    namespace[endPoint].emit("joinsRoom", friendData, (val, err) => {
      if (val) {
        // console.log('room', val)
      } else {
        // console.log(err)
      }
    });
    setFriendData(friendData);
    event.currentTarget.style.backgroundColor = "purple";
    setListClicked(event.currentTarget);

    namespace[endPoint].on(friendData.roomId, (data) => {
      setChatHistory(data);
    });
  };
  return (
    <div className={style.my_friends}>
      <ul>
        {friendList.length !== 0
          ? friendList.map((data, index) => (
              <li
                onClick={(e) => handleClick(e, data)}
                key={index}
                className={style.friend_class}
                >
                {
                  data.userImage?
                  <img
                    className={style.friend_profile_img}
                    src={`data:${data.contentType};base64,${data.userImage}`}
                    alt=""
                  />
                  :
                  <img className={style.friend_profile_img} src="./logo192.png" alt="" />
                }
                <span className={style.friend_name}>{data.username}</span>
                <span className={style.recent_msg_time}>{}</span>
                <span className={style.friend_recent_msg}>
                  {data.recentMessage.message}
                </span>
              </li>
            ))
          : "No Friend!"}
      </ul>
    </div>
  );
};
