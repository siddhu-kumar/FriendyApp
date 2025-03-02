import React, { useContext, useState } from 'react'
import style from './login.module.css'
import { Link, Redirect, Route } from 'react-router-dom'
import { loginUser } from '../../../services/user-service'
import { doLogin, getUserData, isLoggedIn } from '../../../auth'
import { UserContext } from '../../../context/userContext'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
const Login = () => {
  const navigate = useNavigate()
  const {setAuth, setUserDetails} = useContext(UserContext)
  const [userInput, setUserInput] = useState({
    email: "",
    user_password: ""
  })

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.email.trim() === "" || userInput.user_password.trim() === "") {
      return;
    }
    <Loader />
    loginUser(userInput)
    .then((data) => {
      console.log(data)
      doLogin(data)
      setTimeout(()=> {
        setAuth(isLoggedIn)
        setUserDetails(getUserData)
        navigate('/home')
        // window.location.href = "/home"
      },1000)
    })
    .catch(err=> {
      console.log('this is error',err.message);
    })
  }

  return (
    <div className={style.Login}>
      <div className={style.loginHead}>
        <span>FriendyApp</span>
      </div>
      <div className={style.userInput}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="text">User Email</label>
          <input type="text"
            placeholder='Someone@gmail.com'
            name='email'
            value={userInput.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">User Password</label>
          <input type="text"
            placeholder='Password'
            name='user_password'
            value={userInput.user_password}
            onChange={handleChange}
            required
          />
          <Link to="/email-verify">forget password</Link>
          <button className={style.LoginBtn} type='submit'>Login</button>
          <span>Don't have an account? <Link to="/register">Sign-Up here</Link> !</span>
        </form>
      </div>
    </div>
  )
}

export default Login