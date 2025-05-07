import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./home.module.css";
import { createRequest, pagination } from "../../../services/user-service";
// import { createFriend } from '../../../services/friends-service';
import { UserContext } from "../../../context/userContext";
import { doLogout, isLoggedIn } from "../../../auth";

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
        console.log(err)
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
      <div className={style.Users}>
        {userList.length !== 0 ? (
          userList.map((data, index) => (
            <div key={index} 
              ref={index === userList.length -1? lastItemRef: null}
              className={style.usersEntries}>
              {
                data.userImage? 
                <img 
                className={style.usersImage}
                src={`data:${data.contentType};base64,${data.userImage}`} alt="" />
                : 
                <img className={style.tempImage}
                 src="./logo192.png" 
                 alt=""/>
              }
              <div className={style.userInfo}>{data.username}</div>
              <div className={style.userInfo}>{data.contact}</div>
              <div
                className={`${style.addFriend} ${style.userInfo} `}
                onClick={() => addFriend(data)}
              >
                Add Friend
              </div>
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
