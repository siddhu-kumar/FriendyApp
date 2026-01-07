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
  const [BASE_URL, setBASE_URL] = useState(process.env.REACT_APP_BACKEND_HOST);
  const [hasMore, setHasMore] = useState(true);
  const [offSet, setOffSet] = useState(30);

  useEffect(() => {
    // const socketns = io(`${BASE_URL}/chatns`, authHeader)
    // socketns.on('chats',(data)=> {
    //   console.log(data)
    // })    
    console.log(BASE_URL)

    socket = io(`${BASE_URL}/chatns`, authHeader)
    socket.on('endpoint',data => {
      setNamespace(data)
    })
    socket.on('friendlist',data => {
      setFriendList(data)
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
    }
  } > {
      children
    } </ChatContext.Provider>
  )
}

export default ChatProvider