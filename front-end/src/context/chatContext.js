import {
  createContext,
  useState,
  useEffect
} from "react";
import {
  io
} from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js"

export const ChatContext = createContext(null)
export let socket = null

const ChatProvider = ({ children }) => {

  const token = localStorage.getItem('data')
  const parse = JSON.parse(token)
  const authHeader = {
    auth: {
      token: `Bearer ${parse.token}`
    }
  }

  const [namespace, setNamespace] = useState('')
  const [endPoint, setEndPoint] = useState('')
  const [friendList, setFriendList] = useState([])
  const [recentMessage, setRecentMessage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offSet, setOffSet] = useState(30);

  useEffect(() => {
    socket = io(`${process.env.REACT_APP_BACKEND_HOST}/chatns`, authHeader)
    socket.on('friendlist',(data) => {
      setFriendList(data)
    })
    return (()=> {
      socket.off('friendlist');
    })
  }, [])

  // console.log(userDetails.token)
  return (<ChatContext.Provider value={
    {
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