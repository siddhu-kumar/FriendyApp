import React, { useContext, useEffect, useState } from "react";
import style from "./pending.module.css";
import { deletePendingRequest, pendingRequest } from "../../services/user-service";
import { doLogout,isLoggedIn } from "../../auth";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function Pending() {
  const navigate = useNavigate()
  const {setAuth} = useContext(UserContext)
  const [userList,setUserList] = useState('')
  useEffect(()=> {
    pendingRequest().then(data=>{ 
      setUserList(data);
      console.log('r',data);
    }).catch(error => {
       if(error.response.status === 401) { doLogout(); setAuth(isLoggedIn); navigate("/")}})
  },[])

  useEffect(() => { }, [userList])

  const deleteRequest = (e,data) => {
    e.preventDefault();
    console.log(data.friendId)
    deletePendingRequest({data:{friendId:data.friendId}})
    .then(data => {
      console.log(data)
      })
    .catch(error=> {console.error(error); if(error.response.status ===401) doLogout(); setAuth(isLoggedIn);navigate("/")})
  }

  return (<>
    <div className={style.Users}>

        {
          userList.length !== 0 ? userList.map((data, index) =>
            <div key={index} className={style.usersEntries}>
                <div className={style.userInfo}> {data.friendName}</div>
                <button className={`${style.userInfo} ${style.addFriend}`} onClick={(e) => deleteRequest(e,data)}>Cancel</button>
              </div>
          ) :
            <div>
              No Request has been made!
            </div>
        }
      </div>
  </>)
}

export default Pending;
