import React, { useContext, } from 'react'
import style from './home.module.css'
import { createRequest } from '../../../services/user-service';
// import { createFriend } from '../../../services/friends-service';
import { UserContext } from '../../../context/userContext';
const Home = () => {
  const { userList, setUserList } = useContext(UserContext)

  const addFriend = (data) => {
    const updatedList = userList.filter(element => element.email !== data.email)
    setUserList(updatedList)
    const index = userList.find(element => element.email === data.email)
    console.log('add friend ', index, data)
    createRequest({ email: data.email })
      .then(data => { console.log(data) })
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
                <div className={style.userInfo}>{data.name}</div>
                <div className={style.userInfo}>{data.contact}</div>
                <div className={`${style.userInfo} `} onClick={() => addFriend(data)}>Add Friend</div>
              </div>
            </div>
          ) :
            <div>
              Every One is your friend.
            </div>
        }
      </div>
  </>)
}

export default Home