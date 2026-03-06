import React, { useContext, useEffect } from "react";
import style from "./request.module.css";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import "../css/index.css";
import {
  receivedRequest,
  acceptRequest,
  deleteReceivedRequest,
} from "../../services/user-service";

import { doLogout, isLoggedIn } from "../../auth/index";

function Request() {
  const navigate = useNavigate();
  const {
    setAuth,
    setUserList,
    receivedRequestList,
    setReceivedRequestList,
  } = useContext(UserContext);

  useEffect(() => {
    receivedRequest()
      .then((data) => {
        setReceivedRequestList(data);
        console.log(data);
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


  const AcceptRequest = (e, data) => {
    e.preventDefault();
    console.log(data)
    acceptRequest({ requestId: data.friendId })
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

  const handleDeleteRequest = async (e, data) => {
    e.preventDefault();
    console.log(data);

    const updatedList = receivedRequestList.filter((element) => {
      console.log(element.friendId);
      return element.userId !== data.userId;
    });
    setReceivedRequestList(updatedList);

    setUserList((prevList) => {
      const obj = {
        username: data.friendname,
        userId: data.friendId,
      };
      return [obj, ...prevList];
    });

    await deleteReceivedRequest({ data: { friendId: data.friendId } })
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
  };

  return (
    <>
      <div className={style.Users}>
        {receivedRequestList.length !== 0 ? (
          receivedRequestList.map((data, index) => (
            <div key={index} className="template">
              {data.userImage ? (
                <img
                  className="userImage"
                  src={`data:${data.userImage.contentType};base64,${data.userImage.data}`}
                  alt="User 'Image' Not Found"
                />
              ) : (
                <img
                  className="userImage"
                  src="./logo192.png"
                  alt="User Icon"
                />
              )}
              <div className="userInfo">{data.friendname}</div>
              <button className="btn" onClick={(e) => AcceptRequest(e, data)}>
                Accept
              </button>
              <button className="btn" onClick={(e) => handleDeleteRequest(e, data)}>
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
