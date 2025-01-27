import React, { useContext, useState } from 'react'
import style from './profile.module.css'
import { doLogout, editStorage, isLoggedIn } from '../../../auth'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/userContext'
import { editProfile } from '../../../services/user-service'
const Profile = () => {
  const navigate = useNavigate();
  const { setAuth, userDetails } = useContext(UserContext)
  const [btn, setBtn] = useState(true);

  const [user, setUser] = useState(userDetails)

  const handleClick = () => {
    setBtn(!btn)
    if (!btn) {
      editProfile(user).then(data => {
        setUser({ ...user, ...data })
        editStorage(user)
      }).catch(err => {
        console.log(err)
      });
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  }


  return (
    <div className={style.Profile}>
      <div className={style.ProfileHead}>{btn ? 'Profile' : 'Edit Profile'}</div>
      <button className={style.logout} onClick={() => { doLogout(); setAuth(isLoggedIn); navigate('/login') }}>Log Out</button>
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