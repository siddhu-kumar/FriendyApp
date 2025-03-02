import React, { useEffect, useState } from "react";
import style from "./request.module.css";
import { receivedRequest, deletePendingRequest, acceptRequest } from "../../services/user-service";

function Request() {

  const [userList,setUserList] = useState('')
   useEffect(()=> {
     receivedRequest().then(data=>{ 
       setUserList(data);
       console.log(data)
     }).catch(error => console.log(error))
   },[])
 
   useEffect(() => { }, [userList])
 
   const AcceptRequest = (e,data) => {
    e.preventDefault();
    acceptRequest({requestId:data.userId})
    .then(data=> {
      console.log(data)
    })
    .catch(err => console.error(err))
    console.log(data.userId)
   }

   const deleteRequest = (e,data) => {
    e.preventDefault();
    deletePendingRequest({data:{friendId:data.friendId}})
    .then(data => {
      console.log(data)
      })
    console.log(data)
   }
 
   return (<>
     <div className={style.Users}>
         {
           userList.length !== 0 ? userList.map((data, index) =>
             <div key={index} className={style.usersEntries}>
                 <div className={style.userInfo}>{data.name} has sent you Friendy request.</div>
                 <button className={`${style.userInfo} ${style.addFriend}`} onClick={(e) => AcceptRequest(e,data)}>Accept</button>
                 <button className={`${style.userInfo} ${style.addFriend}`} onClick={(e) => deleteRequest(e,data)}>Decline</button>
             </div>
           ) :
             <div>
              No Request for Now
             </div>
         }
       </div>
   </>)
}

export default Request;
