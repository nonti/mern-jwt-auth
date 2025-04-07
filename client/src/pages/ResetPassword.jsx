import React, {  useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MdEmail } from "react-icons/md";
import axios from 'axios'
import { AppContext} from '../contexts/AppContext'
import { Flip, toast } from 'react-toastify';
const ResetPassword = () => {
  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const inputRefs = useRef([]);
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value)

  }

  const handleInput = (e, idx) => {
    if(e.target.value.length > 0 && idx < inputRefs.current.length -1){
      inputRefs.current[idx +1 ].focus();
    }
  }

  const handleKeyDown = (e, idx) => {
    if(e.key === 'Backspace' && e.target.value === '' && idx > 0){
      inputRefs.current[idx - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, idx) => {
      if(inputRefs.current[idx]){
        inputRefs.current[idx].value = char;
      }
    })
  }

  const handleSubmitEmail = async(e)  => {
    try {
      e.preventDefault();
      const {data} = await axios.post(backendUrl, +'api/auth/send-reset-otp')
      data.success ? toast.success(data.message,{ position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", transition: {Flip}}) : 
                    toast.error(data.message, {position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", transition: {Flip}})
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", transition: {Flip}})
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-slate-500 to-slate-300'>
      <img src={assets.logo} alt='Logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')}/>
      {!isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={handleSubmitEmail}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'> Reset Password</h1>
          <p className='text-indigo-400 text-center mb-6'>Enter your registed email address.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>  
            <MdEmail className='text-white' />
            <input type='email' placeholder='Email' className='text-white bg-transparent outline-none' onChange={handleEmailChange} name='email' value={email}/>
          </div>
          <button className='w-full py-2.5 text-white rounded-full bg-gradient-to-r from-indigo-300 to-slate-600 font-medium'>Submit</button>

        </form>
      }
        {/**Otp Form */}
        {!isOtpSubmitted && isEmailSent &&
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-indigo-400 text-center mb-6'>Enter 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, idx) => (
              <input type='text' 
                maxLength={1} key={idx} 
                ref={e => inputRefs.current[idx] = e} 
                onInput={e => handleInput(e,idx)}  
                onKeyDown={e => handleKeyDown(e,idx)}
                required 
                className='w-12 h-12 bg-gray-500 border border-slate-700 rounded-lg text-center text-xl'/> 
            ))}
          </div>
          <button className='w-full py-3 rounded-full text-white bg-gradient-to-r from-indigo-300 to-slate-600 font-medium'>Submit</button>
        </form>
}
        {/** New password */}
        {isOtpSubmitted  && isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-indigo-400 text-center mb-6'>Enter new password below.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500'>  
            <MdEmail className='text-white' />
            <input type='password' placeholder='Password' className='text-white bg-transparent outline-none' onChange={handlePasswordChange} name='newPassword' value={newPassword}/>
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-300 to-slate-600 text-white font-medium'>Submit</button>

        </form>
}
    </div>
  )
}

export default ResetPassword