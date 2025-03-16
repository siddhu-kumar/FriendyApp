import React, { useContext, useState } from 'react'
import style from './login.module.css'
import { Link } from 'react-router-dom'
import { loginUser, getAllUser } from '../../../services/user-service'
import { doLogin,doLogout, getUserData, isLoggedIn } from '../../../auth'
import { UserContext } from '../../../context/userContext'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
const Login = () => {
  const navigate = useNavigate()
  const { setAuth, setUserDetails, setUserList } = useContext(UserContext)
  const [ response, setResponse]= useState(null);
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
        setUserDetails(getUserData)
         getAllUser()
         .then(data=> {
                        setUserList(data)
                    }).catch(error => {
                        if(error.response.data.expire) {    
                            doLogout(); 
                            setUserList('');
                            setUserDetails('');
                            setAuth(isLoggedIn); 
                            navigate("/");
                        }
                        console.log(error.response.data)
                        console.log(localStorage.clear("data"))
                        window.location.href = "/"
                    })
        setTimeout(() => {
          setAuth(isLoggedIn)
          navigate('/home')
          // window.location.href = "/home"
        }, 1000)
      })
      .catch(err => {
        console.log(err)
        if(err.response.status === 401) {
          setResponse(err.response.data.message)
        }
    })
  }

  return (
    <div className={style.Login}>
      <div>{response}
      </div>
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