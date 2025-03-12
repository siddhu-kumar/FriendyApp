import React, { useContext, useState } from 'react'
import style from './otp.module.css'
import { verifyOTP } from '../../../services/reset-password'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/userContext'
import { doLogin, isLoggedIn } from '../../../auth'
import { createUser } from '../../../services/user-service'
 
function OTPVlidate() {
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
    })
      .catch((error) => {
        console.log(error)
        if(error.response.data.message === 'OTP expired, Retry'){
          setOTPExpire(error.response.data.message)
        }
        if (error.response.data) {
          console.log('otp checking',error.response.data.message)
          setOTPExpire(error.response.data.message)
        }
        setCount(count + 3)
        if (count < 3) {
          console.log(count)
        } else {
          navigate("/home")
        }
        console.log(error)
      })
      console.log(error)
  }

  return (
    <div className={style.OTP}>
        <div>
            {otpExpire}
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
     
    </div>
  )
}

export default OTPVlidate;