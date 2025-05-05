import React, { useEffect, useState } from "react";
import style from "./pending.module.css";
import { deletePendingRequest, pendingRequest } from "../../services/user-service";

function Pending() {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
  const { setAuth, userList, setUserList, sentRequestList, setSentRequestList } = useContext(UserContext);
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)

  const [userList,setUserList] = useState('')
  useEffect(()=> {
    pendingRequest().then(data=>{ 
      setUserList(data);
      console.log(data);
    }).catch(error => console.log(error))
  },[])

<<<<<<< HEAD
  useEffect(() => { }, [userList])
=======
  useEffect(() => { }, [setUserList,sentRequestList])
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)

  const deleteRequest = (e,data) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log(data.friendId)
    deletePendingRequest({data:{friendId:data.friendId}})
    .then(data => {
      console.log(data)
      })
    .catch(error=> console.error(error))
  }
=======
    console.log(data);
    console.log(sentRequestList)

    const updatedList = sentRequestList.filter((element) => element.friendId !== data.friendId);
    setSentRequestList(updatedList);
    console.log(updatedList)
    setUserList(prevList => [...prevList,data])
    console.log(userList)
    deletePendingRequest({ data: { friendId: data.friendId } })
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
      window.location.reload()
  };
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)

  return (<>
    <div className={style.Users}>

        {
          userList.length !== 0 ? userList.map((data, index) =>
            <div key={index} className={style.usersEntries}>
<<<<<<< HEAD
                <div className={style.userInfo}> {data.friendName}</div>
                <button className={`${style.userInfo} ${style.addFriend}`} onClick={(e) => deleteRequest(e,data)}>Cancel</button>
              </div>
          ) :
            <div>
              No Request has been made!
=======
              <div className={style.userInfo}>{data.friendName}</div>
              <button
                className={`${style.userInfo} ${style.addFriend}`}
                onClick={(e) => deleteRequest(e, data)}
              >
                Cancel
              </button>
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)
            </div>
        }
      </div>
  </>)
}

export default Pending;
