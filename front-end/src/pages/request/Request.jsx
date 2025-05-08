import React, { useContext, useEffect, useState } from "react";
import style from "./request.module.css";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

import {
  receivedRequest,
  acceptRequest,
  deleteReceivedRequest,
} from "../../services/user-service";

import { doLogout, isLoggedIn } from "../../auth";

function Request() {
  const navigate = useNavigate();
  const { setAuth } = useContext(UserContext);
  const [userList, setUserList] = useState("");

  useEffect(() => {
    receivedRequest()
      .then((data) => {
        setUserList(data);
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          doLogout();
          setAuth(isLoggedIn);
          navigate("/login");
        }
      });
  }, []);

  //  useEffect(() => { }, [userList])

  const AcceptRequest = (e, data) => {
    e.preventDefault();

    acceptRequest({ requestId: data.userId })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 401) {
          doLogout();
          setAuth(isLoggedIn);
          navigate("/login");
        }
      });
    console.log(data.userId);
  };

  const deleteRequest = (e, data) => {
    e.preventDefault();
    deleteReceivedRequest({ data: { friendId: data.friendId } })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          doLogout();
          setAuth(isLoggedIn);
          navigate("/login");
        }
      });
    console.log(data);
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
                  src={`data:${data.userImage.contentType};base64,${data.userImage.data}`} alt="ftyjhvjh" />
                  : 
                  <img className={style.tempImage}
                    src="./logo192.png" 
                    alt=""/>
                }
              <div className={style.userInfo}>
                {data.name}
              </div>
              <button
                className={`${style.userInfo} ${style.addFriend}`}
                onClick={(e) => AcceptRequest(e, data)}
              >
                Accept
              </button>
              <button
                className={`${style.userInfo} ${style.addFriend}`}
                onClick={(e) => deleteRequest(e, data)}
              >
                Decline
              </button>
            </div>
          ))
        ) : (
          <div>No Request for Now</div>
        )}
      </div>
    </>
  );
}

export default Request;
