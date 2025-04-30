import React, { useContext, useEffect } from "react";
import style from "./home.module.css";
import { createRequest } from "../../../services/user-service";
// import { createFriend } from '../../../services/friends-service';
import { UserContext } from "../../../context/userContext";
import { doLogout, isLoggedIn } from "../../../auth";

const Home = () => {
  const { userList, setUserList, setAuth } = useContext(UserContext);

  const addFriend = (data) => {
    const updatedList = userList.filter(
      (element) => element.email !== data.email
    );
    setUserList(updatedList);
    const index = userList.find((element) => element.email === data.email);
    console.log("add friend ", index, data);
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
            <div key={index} className={style.usersEntries}>
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
