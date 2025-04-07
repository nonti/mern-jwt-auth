import React, { useContext, useEffect, useRef } from 'react'
import {assets} from '../assets/assets';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';
import { Flip, toast } from 'react-toastify';
const VerifyAccount = () => {
  axios.defaults.withCredentials = true
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { backendUrl, getUserInfo, isLoggedIn, userInfo } = useContext(AppContext)

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await  axios.post(backendUrl + 'api/auth/verify-account', {otp})
      if(data.success) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: {Flip}
        })
        getUserInfo();
        navigate('/')
      }else{
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: {Flip}
        })
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: {Flip}
      })
    }
  }

  useEffect(() => {
      isLoggedIn && userInfo && userInfo.isAccountVerified && navigate('/')
  }, [isLoggedIn, userInfo])
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-slate-500 to-slate-300'>
        <img src={assets.logo} alt='Logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => Navigate('/')}/>
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={handleSubmit}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'> Email Verify OTP</h1>
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
          <button className='w-full py-3 rounded-full text-white bg-gradient-to-r from-indigo-300 to-slate-600 font-medium'>Verify Email</button>
        </form>
    </div>
  )
}

export default VerifyAccount