import React, { useState } from 'react'
import style from './emailverify.module.css'
import { emailVerify } from '../../../services/reset-password'
import { useNavigate } from 'react-router-dom'

function EmailVerify() {
    const navigate = useNavigate()
    const [email,setEmail] = useState({
        email:''
    })
    const [response,setResponse] = useState(null)
    const handleChange = async (e) => {
        const {name,value} = e.target;
        setEmail({...email,[name]:value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const pattern = /^([a-zA-Z\d._-])+@[a-zA-Z\d]+\.[a-zA-Z]{2,}$/
        if (!pattern.test(email.email)) {
            setResponse('Email is not looking valid.')
            return;
        }
        localStorage.setItem('email',email.email)
        emailVerify(email).then((data)=> {
            navigate('/otp-verify', {state:{reg:false}});
            console.log(data)
        })
        .catch((error)=> {
            // console.log(error.response.data.message)
            setResponse(error.response.data.message)
        }) 
    
    }
  return (
    <div className={style.Email}>
        <div>{response}</div>
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