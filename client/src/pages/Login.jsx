import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets';
import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { toast } from 'react-toastify';
const Login = () => {

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn} = useContext(AppContext)

  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname:'',
    email:'',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = state === 'Sign Up' ? backendUrl + 'api/auth/register' : backendUrl + 'api/auth/login'
      
        let response = await fetch(url, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if(!response.ok){
          const errorData = await response.json()
          toast.error(errorData.message || `HTTP error! status: ${response.status} `)
          return;
        }

        const data = await response.json();
        if(data.success){
          setIsLoggedIn(true)
          navigate('/')
        }else{
          toast.error(data.message)
        }
        
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-slate-500 to-slate-300'>
      <img src={assets.logo} alt='Logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')}/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-center text-white mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6 '>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>

        <form onSubmit={handleSubmit}>
          {state === 'Sign Up' && (
            <>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600'>
            <FaUser className='text-white' />
              <input type='text' placeholder='Full name' className='text-white' onChange={handleChange} name='firstname' value={formData.firstname}/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600'>
            <FaUser className='text-white' />
              <input type='text' placeholder='Lastname' className='text-white' onChange={handleChange} name='lastname' value={formData.lastname}/>
          </div>
          </>
          )}
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600'>
            <MdEmail className='text-white' />
              <input type='email' placeholder='Email' className='text-white' onChange={handleChange} name='email' value={formData.email}/>
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600'>
            <MdPassword className='text-white' />
              <input type='password' placeholder='Password' className='text-white' onChange={handleChange} name='password' value={formData.password}/>
          </div>
          {state === 'Sign Up' ? '' : (<p className='mb-4 textind cursor-pointer' onClick={() => navigate('/reset-password')}>Forgot password?</p>)} 
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-300 to-slate-600 font-medium'>{state}</button>
        </form> 
        {state === 'Sign Up' ? (
        <p className='text-center text-gray-400 cursor-pointer text-xs mt-4'>Already have an account?{' '} <span onClick={()=>setState('Login')}className='text-blue-300 cursor-pointer underline'>Login here</span></p>

        ):(
        <p className='text-center text-gray-400 cursor-pointer text-xs mt-4'>{"Don't"} have an account?{' '} <span onClick={()=> setState('Sign Up')}className='text-blue-300 cursor-pointer underline'>Signup</span></p>

        )}
      </div>
    </div>
  )
}

export default Login