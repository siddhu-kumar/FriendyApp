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
  const [error, setError] = useState({
    valid: '',
    object:'',
    message:''});
  const [otpExpire, setOTPExpire] = useState(null);

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
          navigate("/home");
        }).catch(err=> {
          console.log(err.response.data)
          if(!err.response.data.valid && err.response.data.object === "contact") 

          setError({
            valid: err.response.data.isValid,
            object: err.response.data.object,
            message:"Contact already exists: "+err.response.data.message})
        })
        console.log(data)
      } else {
        navigate('/reset-password');
      }
    })
      .catch((error) => {
        console.log(error)
        if(error.response.data.message === 'OTP expired, Retry'){
          setOTPExpire(error.response.data.message)
        }
        if (error.response.data) {
          console.log('otp checking',error.response.data.message)
        }
        setCount(count + 3)
        if (count < 3) {
          console.log(count)
          // handleSubmit(e);
        } else {
          navigate("/home")
        }
        console.log(error)
      })
  }

  return (
    <div className={style.OTP}>
      <div className={style.error}>
      {
        !error.valid?error.message:''
      }
      </div>
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
      {
        otpExpire?<button>{otpExpire}</button>:''
      }
    </div>
  )
}

export default OTPVerify