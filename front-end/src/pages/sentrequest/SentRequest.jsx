import React, { useContext, useEffect } from "react";
import style from "./sentrequest.module.css";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { deleteSentRequest, pendingRequest } from "../../services/user-service";
import "../css/index.css";
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

  const deleteRequest = (e, data) => {
    e.preventDefault();
    console.log(data);

    const updatedList = sentRequestList.filter((element) => {
      console.log(element);
      return element.userId !== data.userId;
    });
    setSentRequestList(updatedList);
    
    setUserList((prevList) => {
      const obj = {
        username: data.friendname,
        userId: data.friendId,
      };
      return [obj, ...prevList];
    });
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
  };

  return (
    <>
      <div className={style.Users}>
        {sentRequestList.length !== 0 ? (
          sentRequestList.map((data, index) => (
            <div key={index} className="template">
              {data.friendImage ? (
                <img
                  className="userImage"
                  src={`data:${data.contentType};base64,${data.friendImage}`}
                  alt="User 'Image'"
                />
              ) : (
                <img
                  className="userImage"
                  src="./logo192.png"
                  alt="User Icon"
                />
              )}
              <div className="userInfo">{data.friendname}</div>
              <button className="btn" onClick={(e) => deleteRequest(e, data)}>
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
