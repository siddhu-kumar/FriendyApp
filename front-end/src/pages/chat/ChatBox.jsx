import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./chat.module.css";
import { ChatContext, socket } from "../../context/chatContext";
export const ChatBox = ({ friendData, chatHistory, setChatHistory }) => {
  const { namespace, setFriendList, endPoint } = useContext(ChatContext);
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState({
    sender: friendData.namespaceId,
    receiver: friendData.userId,
    date: Date.now(),
    message: "",
  });

  
  useEffect(() => {
    socket.off("listenMessage");
    socket.on("listenMessage", (messageObj) => {
      socket.emit('listenMessageAck',{ message: 'received'})
      console.log(messageObj);

      setChatHistory((prevChatHistory) => [...prevChatHistory, messageObj]);
      setFriendList((prevList) => {
        return prevList.map((ele) => {
          if (ele.userId === messageObj.sender) {
            return { ...ele, recentMessage: messageObj };
          }
          return ele;
        });
      });
      // callback({ message: "received" });
    });
  }, [endPoint, setChatHistory, setFriendList, namespace, socket]);

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await socket.emitWithAck(
      "newMessageToRoom",
      message
    );
    console.log(response)
    setMessage({
      sender: friendData.namespaceId,
      receiver: friendData.userId,
      message: "",
      date: Date.now()
    });
    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    setFriendList((prevList) =>
      prevList.map((ele) =>
        ele.userId === message.receiver
          ? { ...ele, recentMessage: message }
          : ele
      )
    );
    // console.log(friendList)
  };
  return (
    <>
      <div id={style.chat}>
        <div id={style.messages}>
          {chatHistory && chatHistory.length > 0
            ? chatHistory.map((chat, index) =>
                chat.sender === friendData.namespaceId ? (
                  <li className={style.client} key={index}>
                    {chat.message}
                    {index === chatHistory.length - 1 && (
                      <div ref={chatEndRef} />
                    )}
                  </li>
                ) : (
                  <li className={style.user} key={index}>
                    {chat.message}
                    {index === chatHistory.length - 1 && (
                      <div ref={chatEndRef} />
                    )}
                    {/*  receiver: '8a50d013-933b-45d5-895e-c966ee9da26e', */}
                  </li>
                )
              )
            : ""}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className={style.chat_forms}>
          <input
            type="text"
            placeholder="Message"
            className={style.chat_input}
            name="message"
            id={style.message}
            value={message.message}
            onChange={handleChange}
            autoFocus={true}
          />
          <button
            className={`${style.send_chat} ${style.chat_button}`}
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};
