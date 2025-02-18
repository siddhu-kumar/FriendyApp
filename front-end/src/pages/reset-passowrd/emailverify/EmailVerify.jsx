import React, { useState } from 'react'
import style from './emailverify.module.css'
import { emailVerify } from '../../../services/reset-password'
import { useNavigate } from 'react-router-dom'

function EmailVerify() {
    const navigate = useNavigate()
    const [email,setEmail] = useState({
        email:''
    })

    const handleChange = async (e) => {
        const {name,value} = e.target;
        setEmail({...email,[name]:value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('handle')
        console.log(email)
        localStorage.setItem('email',email.email)
        emailVerify(email).then((data)=> {
            navigate('/otp-verify', {state:{reg:false}});
            console.log(data)
        })
        .catch((error)=> {
            console.log(error)
        }) 
        
    }
  return (
    <div className={style.Email}>
        <span>Verify Your Email</span>
        <form onSubmit={handleSubmit} >
            <label htmlFor="text">Enter Email</label>
            <input 
                type="text" 
                placeholder='someone@gmail.com' 
                name='email' 
                value={email.email} 
                onChange={handleChange} 
                autoFocus
            />
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default EmailVerify