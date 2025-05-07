import React, { useContext, useEffect } from "react";
import style from "./pending.module.css";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import {
  deleteSentRequest,
  pendingRequest,
} from "../../services/user-service";
import { doLogout, isLoggedIn } from "../../auth";

function Pending() {
  const navigate = useNavigate();
  const {
    setAuth,
    userList,
    setUserList,
    sentRequestList,
    setSentRequestList,
  } = useContext(UserContext);

  useEffect(() => {
    pendingRequest()
      .then((data) => {
        console.log(data);
        setSentRequestList(data);

      })
      .catch((error) => {
        if (error.response.status === 401) {
          doLogout();
          setAuth(isLoggedIn);
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {}, [setUserList, setSentRequestList, sentRequestList]);

  const deleteRequest = (e, data) => {
    e.preventDefault();
    console.log(data);
    console.log(sentRequestList);

    const updatedList = sentRequestList.filter(
      (element) => element.userId !== data.userId
    );
    console.log(updatedList)
    setSentRequestList(updatedList);
    console.log(updatedList);
    setUserList((prevList) => [data, ...prevList]);
    console.log(userList);
    deleteSentRequest({ data: { friendId: data.friendId } })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          doLogout();
          setAuth(isLoggedIn);
          navigate("/login");
        }
      });
    window.location.reload();
  };

  return (
    <>
      <div className={style.Users}>
        {sentRequestList.length !== 0 ? (
          sentRequestList.map((data, index) => (
            <div key={index} className={style.usersEntries}>
              <div className={style.userInfo}>{data.friendName}</div>
              <div className={style.userInfo}>{data.friendEmail}</div>
              <button
                className={`${style.userInfo} ${style.addFriend}`}
                onClick={(e) => deleteRequest(e, data)}
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <div>No Request has been made!</div>
        )}
      </div>
    </>
  );
}

export default Pending;
