import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./chat.module.css"
import { ChatContext } from "../../context/chatContext";
export const ChatBox = ({ friendData, chatHistory, setChatHistory }) => {
    const { namespace, friendList, setFriendList, endPoint } = useContext(ChatContext);
    const chatEndRef = useRef(null);
    const data = friendData
    const [message, setMessage] = useState({
        sender: friendData.namespaceId,
        receiver: friendData.userId,
        // date: '',
        message: '',
    })

        namespace[endPoint].off('listenMessage');
        namespace[endPoint].on('listenMessage', (messageObj, callback) => {
            console.log(messageObj)
            setChatHistory(prevChatHistory => [...prevChatHistory, messageObj]);
            setFriendList(prevList => {
                return prevList.map(ele => {
                    if (ele.userId === messageObj.sender) {
                        // console.log("Condition is true for:", ele.userId, messageObj.sender);
                        return { ...ele, recentMessage: messageObj };
                    }
                    return ele;
                });
            });
            // console.log(friendList);
            callback({ message: 'received' })
        })
    
    const handleChange = async (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setMessage({ ...message, [name]: value })
    }
    
    useEffect(()=> {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth'});
        }
    },[chatHistory])


    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(friendData, endPoint)
        // setMessage({ ...message, [`date`]: Date.now() })
        const response = await namespace[endPoint].emitWithAck('newMessageToRoom', message)
        // console.log(response)
        setMessage({
            sender: friendData.namespaceId,
            receiver: friendData.userId,
            message: '',
        });
        setChatHistory(prevChatHistory => [...prevChatHistory, message]);
        setFriendList(prevList => 
            prevList.map(ele =>
                ele.userId === message.receiver
                ?{ ...ele, recentMessage: message }:
                 ele 
            )
        );
        // console.log(friendList)
    }
    return (<>
        <div id={style.chat}>
            <div id={style.messages}>
                {
                    chatHistory && chatHistory.length > 0 ? chatHistory.map((chat, index) => (
                        chat.sender === data.namespaceId ? 
                        <li className={style.client} key={index}>
                            {chat.message}
                       {index === chatHistory.length -1 && <div ref={chatEndRef} />}
                        </li>
                        : 
                        <li className={style.user} key={index}>
                            {chat.message}
                        {index === chatHistory.length -1 && <div ref={chatEndRef} />}
                        </li>
                    ))
                        : ''
                }
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSubmit} className={style.chat_forms} >
                <input type="text"
                    placeholder="Message"
                    className={style.chat_input}
                    name="message"
                    id={style.message}
                    value={message.message}
                    onChange={handleChange}
                    autoFocus={true}
                />
                <button className={`${style.send_chat} ${style.chat_button}`} type="submit">Send</button>
            </form>
        </div>
    </>);
};
