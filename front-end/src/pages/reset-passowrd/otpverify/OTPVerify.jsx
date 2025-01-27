import React, { useState } from 'react'
import style from './otp.module.css'
import { verifyOTP } from '../../../services/reset-password'
import { useNavigate } from 'react-router-dom'
function OTPVerify() {
  const navigate = useNavigate();
  const [otp,setOtp] = useState({
    otp:''
  })
  

  const handleChange = async (e) => {
    const {name,value} = e.target
    setOtp({...otp,[name]:value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(otp,'yui')
    verifyOTP(otp).then((data)=> {
      console.log(data)
      navigate('/reset-password')
    })
    .catch((error)=> {
      console.log(error)
    })
  }

  return (
    <div className={style.OTP}>
        <span>Verify Your OTP</span>
        <form onSubmit={handleSubmit} >
            <label htmlFor="text">Enter OTP</label>
            <input 
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