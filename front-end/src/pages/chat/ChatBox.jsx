import { useContext, useEffect, useRef, useState } from "react";
import style from "./chat.module.css";
import { ChatContext, socket } from "../../context/chatContext";
import MessageCard from "./MessageCard";
import '../css/index.css'
export const ChatBox = ({ friendData, chatHistory, setChatHistory }) => {
  const {
    namespace,
    setFriendList,
    endPoint,
    setHasMore,
    hasMore,
    offSet,
    setOffSet,
  } = useContext(ChatContext);
  const chatEndRef = useRef(null);
  const chatTopRef = useRef(null);
  const messagesRef = useRef(null);
  const prevScrollHeightRef = useRef(0);

  const [message, setMessage] = useState({
    sender: friendData.namespaceId,
    receiver: friendData.userId,
    time: Date.now(),
    message: "",
  });
  const [flag,setFlag] = useState(true);

  const limit = 10;

  useEffect(() => {
    
    if (hasMore) {
      socket.on("getNextMessage", (data) => {
        console.log(data);
        if (data.length === 0) {
          setHasMore(false);
          return;
        } else {
          setChatHistory((prevmsg) => [...data, ...prevmsg]);
          setOffSet((prev) => prev + data.length);
          requestAnimationFrame(() => {
            if (!messagesRef.current) return;
            const newScrollHeight = messagesRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
            messagesRef.current.scrollTop += scrollDiff;
          });
        }
      });
    }
    return () => {
      socket.off("getNextMessage");
    };
  }, [hasMore, offSet, setChatHistory, setHasMore, setOffSet]);

  useEffect(() => {
    const loadMoreMessages = () => {
      if (!hasMore || !messagesRef.current) return;

      prevScrollHeightRef.current = messagesRef.current.scrollHeight;

      socket.emit("message_chunk", { offSet, limit });
    };

    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            loadMoreMessages();
          }, 1500);
        }
      },
      { threshold: 1 },
      { delay: 3000 }
    );
    if (chatTopRef.current) {
      observer.observe(chatTopRef.current);
    }
    return () => observer.disconnect();
  }, [offSet, hasMore]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory.length]);

  useEffect(() => {
    socket.off("listenMessage");
    socket.on("listenMessage", (messageObj) => {
      socket.emit("listenMessageAck", { message: "received" });
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
  }, [endPoint, setChatHistory, setFriendList, namespace]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(message)
    if(message.message.trim().length === 0) {
      setFlag(false);
      return;
    }
    const response = await socket.emitWithAck("newMessageToRoom", message);
    console.log(message);
    setMessage({
      sender: friendData.namespaceId,
      receiver: friendData.userId,
      message: "",
      time: Date.now(),
    });

    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    setFriendList((prevList) =>
      prevList.map((ele) =>
        ele.userId === message.receiver
          ? { ...ele, recentMessage: message }
          : ele
      )
    );
    console.log(chatHistory)
  };
  return (
    <>
      <div id={style.chat}>
        <div id={style.messages} ref={messagesRef}>
          <div ref={chatTopRef} />
          {chatHistory && chatHistory.length > 0
            ? chatHistory.map((chat, index) =>
                chat.sender === friendData.namespaceId ? (
                  <MessageCard
                    message={chat.message}
                    time={chat.time}
                    index={index}
                    chatEndRef={chatEndRef}
                    chatLength={chatHistory.length}
                    order={style.client}
                    key={index}
                  />
                ) : (
                  <MessageCard
                    message={chat.message}
                    time={chat.time}
                    index={index}
                    chatEndRef={chatEndRef}
                    chatLength={chatHistory.length}
                    order={style.user}
                    key={index}
                  />
                )
              )
            : "Start message"}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className={style.chat_forms}>
          <span className="emptyMessage">
            {flag?'':'Type some text'}
          </span>
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
