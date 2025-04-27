import React, { useState } from 'react'
import style from './otp.module.css'
import { userOTPVerify } from '../../../services/reset-password'
import { useNavigate } from 'react-router-dom'

function OTPVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState({
    otp: ''
  })

  const [count, setCount] = useState(0)

  const [otpExpire, setOTPExpire] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target
    setOtp({ ...otp, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(otp, 'yui')

    userOTPVerify(otp).then((data) => {
      console.log(data)
      navigate('/reset-password');
    })
      .catch((error) => {
        console.log(error)
        if (error.response.data.message === 'OTP expired, Retry') {
          setOTPExpire(error.response.data.message)
        }
        if (error.response.data) {
          console.log('otp checking', error.response.data.message)
          setOTPExpire(error.response.data.message)
        }
        setCount(count + 3)
        if (count < 3) {
          console.log(count)
          // handleSubmit(e);
        } else {
          navigate("/")
        }
        console.log(error)
      })
  }

  return (
    <div className={style.OTP}>
      <div className={style.error}>
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
        otpExpire
          ? <button
              onClick={navigate('/email-verify')}
            >
              {otpExpire}
            </button>
          : ''
      }
    </div>
  )
}

export default OTPVerify