import React, { useContext, useState } from 'react'
import style from './profile.module.css'
import { doLogout, editStorage, isLoggedIn } from '../../../auth'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/userContext'
import { editProfile } from '../../../services/user-service'
const Profile = () => {
  const navigate = useNavigate();
  const { setAuth, userDetails, setUserDetails, setUserList } = useContext(UserContext)
  const [btn, setBtn] = useState(true);

  const [user, setUser] = useState(userDetails)

  const handleClick = () => {
    setBtn(!btn)
    if (!btn) {
      if(user === userDetails) {
        // console.log('nothing changed')
      } else {
        editProfile(user).then(data => {
          setUser({ ...user, ...data })
          editStorage(user)
        }).catch(err => {
          console.log(err)
        });
      }
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  }

  const handleLogout = (e) => {
    e.preventDefault();
    doLogout(); 
    setUserList('');
    setUserDetails('');
    setAuth(isLoggedIn); 
    navigate('/login');
  }


  return (
    <div className={style.Profile}>
      <div className={style.ProfileHead}>{btn ? 'Profile' : 'Edit Profile'}</div>
      <div className={style.ProfilePicture}>
        <img src="./logo192.png" alt="" />
        {!btn?<button className={style.ImgBtn}>change</button>:""}
      </div>
      <button className={style.logout} onClick={handleLogout}>Log Out</button>
      {
        btn ? <>
          <div className={style.userInfo}>{user.name}</div>
          <div className={style.userInfo}>{user.email}</div>
          <div className={style.userInfo}>{user.contact}</div>
          
        </>
          :
          <form className={style.EditProfile}
            onSubmit={handleClick}
          >
            <label htmlFor="text">Your Username</label>
            <input type="text"
              value={user.name}
              name='name'
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Your Email</label>
            <input type="text"
              value={user.email}
              name='email'
              onChange={handleChange}
              required
            />
            <label htmlFor="text">Your Contact</label>
            <input type="text"
              value={user.contact}
              name='contact'
              onChange={handleChange}
              required
            />
            
          </form>
      }
      <button className={`${style.userInfo} ${style.ProfileBtn}`}
        type='submit'
        onClick={handleClick}
      >
        {btn ? 'Edit' : 'Save'}
      </button>
    </div>
  )
}

export default Profile