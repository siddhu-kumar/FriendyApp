import React, { useContext, useState } from "react";
import style from "./chat.module.css"
import { ChatContext } from "../../context/chatContext";
export const ChatBox = ({ friendData, chatHistory, setChatHistory }) => {
    const { namespace, endPoint } = useContext(ChatContext);
    const data = friendData
    const [message, setMessage] = useState({
        sender: friendData.namespaceId,
        receiver: friendData.userId,
        date: '',
        message: '',
    })

    // namespace[endPoint].off('listenMessage');
    namespace[endPoint].on('listenMessage', (messageObj, callback) => {
        // console.log(messageObj)
        setChatHistory([...chatHistory, messageObj])
        callback({ message: 'received' })
    })
    const handleChange = async (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setMessage({ ...message, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(friendData, endPoint)
        setMessage({ ...message, [`date`]: Date.now() })
        const response = await namespace[endPoint].emitWithAck('newMessageToRoom', message)
        console.log(response)
        setChatHistory([...chatHistory, message])
        setMessage({
            sender: friendData.namespaceId,
            receiver: friendData.userId,
            date: '',
            message: '',
        });
    }
    return (<>
        <div id={style.chat}>
            <div id={style.messages}>
                {
                    chatHistory && chatHistory.length > 0 ? chatHistory.map((chat, index) => (
                        chat.sender === data.namespaceId ? <li className={style.client} key={index}>{chat.message}</li>
                            : <li className={style.user} key={index}>{chat.message}</li>
                    ))
                        : ''
                }
            </div>
            <form onSubmit={handleSubmit} className={style.chat_forms} >
                <input type="text"
                    placeholder="Message"
                    className={style.chat_input}
                    name="message"
                    id={style.message}
                    value={message.message}
                    onChange={handleChange}
                />
                <button className={`${style.send_chat} ${style.chat_button}`} type="submit">Send</button>
            </form>
        </div>
    </>);
};
