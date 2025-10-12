import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./home.module.css";
import { createRequest, pagination } from "../../../services/user-service";
// import { createFriend } from '../../../services/friends-service';
import { UserContext } from "../../../context/userContext";
import { doLogout, isLoggedIn } from "../../../auth";
import "../../css/index.css"
const pageSize = 5;

const Home = () => {
  const { userList, setUserList, setAuth, setSentRequestList } = useContext(UserContext);

  const [currentCursor, setCurrentCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const observer = useRef(0);

  const loadData = async (cursor) => {
    if(loading) return;
    setLoading(true);
    try {
      pagination({cursor, pageSize})
      .then(data => {
        // console.log(data)
        if(data.message) {
          console.log(data.message)
          return;
        }
        if(data.length > 0) {
          setUserList((prevItems) => [...prevItems, ...data]);
          setCurrentCursor((prevCursor) => prevCursor + data.length)
        }
      })
      .catch(err => {
        // console.log(err)
      });
    } catch(error) {
      console.log('Error fetching data:',error);
    } finally {
      setLoading(false);
    }
  }

  const initializedRef = useRef(false);
  useEffect(()=> {
    setTimeout(()=> {
      if(!initializedRef.current) {
        initializedRef.current = true;
        loadData(currentCursor);
      }
    },1000)
  },[])

  const lastItemRef = useRef();
  useEffect(()=> {
    if(loading) return;
    if(observer.current) observer.current.disconnect();

    const callback = (entries) => {
      if(entries[0].isIntersecting) {
        loadData(currentCursor);
        // console.log('call')
      }
    }
    observer.current = new IntersectionObserver(callback);
    if(lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => {
      if(observer.current) observer.current.disconnect();
    }
  },[loading, currentCursor])

  const addFriend = (data) => {
    const updatedList = userList.filter(
      (element) => element.email !== data.email
    );
    setSentRequestList(prevList => [...prevList, data])
    console.log(updatedList)
    setUserList(updatedList);
    const index = userList.find((element) => element.email === data.email);
    console.log("add friend ", index);
    console.log(data)
    createRequest({ email: data.email })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) doLogout();
        setAuth(isLoggedIn);
      });
  };

  return (
    <>
      <div className="Users1">
        {userList.length !== 0 ? (
          userList.map((data, index) => (
            <div key={index} 
              ref={index === userList.length -1? lastItemRef: null}
              className="template"
              
              >
              {
                data.image? 
                <img 
                className="userImage"
                src={`data:${data.image.contentType};base64,${data.image.data}`} alt="ftyjhvjh" />
                : 
                <img className="userImage"
                 src="./logo192.png" 
                 alt=""/>
              }
              <div className="userInfo">{data.name}</div>
              <div className="userInfo">{data.contact}</div>
              <button
                className="btn"
                onClick={() => addFriend(data)}
              >
                Add Friend
              </button>
            </div>
          ))
        ) : (
          <div>Every One is your friend.</div>
        )}
      </div>
    </>
  );
};

export default Home;




