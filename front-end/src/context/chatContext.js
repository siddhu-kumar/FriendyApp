import {
  createContext,
  useState,
  useEffect
} from "react";
import {
  io
} from "socket.io-client";

export const ChatContext = createContext(null);

const ChatProvider = ({ children }) => {

  const [socket, setSocket] = useState(null);
  const [namespace, setNamespace] = useState('')
  const [endPoint, setEndPoint] = useState('')
  const [friendList, setFriendList] = useState([])
  const [recentMessage, setRecentMessage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offSet, setOffSet] = useState(30);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BACKEND_HOST}/chatns`, {withCredentials: true})
    setSocket(newSocket);
    newSocket.on('friendlist',(data) => {
      setFriendList(data)
      console.log(data)
    })
    return (()=> {
      newSocket.off('friendlist');
      newSocket.disconnect();
    })
  }, [])

  return (<ChatContext.Provider value={
    {
      socket,
      namespace,
      setNamespace,
      endPoint,
      friendList,
      recentMessage,
      hasMore,
      offSet,
      setFriendList,
      setRecentMessage,
      setHasMore,
      setOffSet,
      setEndPoint,
    }
  } > {
      children
    } </ChatContext.Provider>
  )
}

export default ChatProvider