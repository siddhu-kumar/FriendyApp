import React, { useContext, useState } from 'react'
import style from './otp.module.css'
import { verifyOTP } from '../../../services/reset-password'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/userContext'
import { doLogin, isLoggedIn } from '../../../auth'
import { getUserData } from '../../../auth'
import { createUser, emailValidate, loginUser } from '../../../services/user-service'
function OTPVerify() {
  const { state } = useLocation();
  const { setAuth, userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState({
    otp: ''
  })

  const [count, setCount] = useState(0)

  const handleChange = async (e) => {
    const { name, value } = e.target
    setOtp({ ...otp, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(otp, 'yui')

    verifyOTP(otp).then((data) => {
      if (state.reg) {
        createUser(userDetails).then(data => {
          console.log(data);
          doLogin(data)
          setAuth(isLoggedIn);
          navigate('/');
        })
        console.log(data)
      } else {
        navigate('/reset-password');
      }
    })
      .catch((error) => {
        console.log(error)
        if (error.response.data) {
          console.log('otp checking')
        }
        setCount(count + 3)
        if (count < 3) {
          console.log(count)
          // handleSubmit(e);
        } else {
          navigate('/login')
        }
        console.log(error)
      })
  }

  return (
    <div className={style.OTP}>
      <span>Verify Your OTP</span>
      <form onSubmit={handleSubmit} >
        <label htmlFor="text">Enter OTP</label>
        <input
          autoFocus
          type="text"
          placeholder=''
          name='otp'
          value={otp.otp}
          onChange={handleChange}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default OTPVerify