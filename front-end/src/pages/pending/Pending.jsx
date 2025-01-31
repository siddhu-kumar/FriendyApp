import React, { useEffect, useState } from "react";
import style from "./pending.module.css";
import { deletePendingRequest, pendingRequest } from "../../services/user-service";

function Pending() {

  const [userList,setUserList] = useState('')
  useEffect(()=> {
    pendingRequest().then(data=>{ 
      setUserList(data);
    }).catch(error => console.log(error))
  },[])

  useEffect(() => { }, [userList])

  const deleteRequest = (e,data) => {
    e.preventDefault();
    console.log(data.friendId)
    deletePendingRequest({data:{friendId:data.friendId}})
    .then(data => {
      console.log(data)
      })
    .catch(error=> console.error(error))
  }

  return (<>
    <div className={style.Users}>
        <div className={style.usersHead}>
          <div className={style.nums}>S No.</div>
          <div className={style.user}>
            <div className={style.userInfo}>Name</div>
            <div className={style.userInfo}>Contact</div>
            <div className={style.userInfo}>Add Friend</div>
          </div>
        </div>
        {
          userList.length !== 0 ? userList.map((data, index) =>
            <div key={index} className={style.usersEntries}>
              <div className={`${style.nums}`}>{index + 1}</div>
              <div className={style.user}>
                <div className={style.userInfo}>{data.friendName}</div>
                <button className={`${style.userInfo} ${style.button}`} onClick={(e) => deleteRequest(e,data)}>Cancel</button>
              </div>
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
