import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import { Flip, toast } from 'react-toastify';
const Header = () => {
  const navigate = useNavigate();
  const { userInfo, backendUrl, setIsLoggedIn, setUserInfo} = useContext(AppContext)

  const handleClick = () => {
    navigate('/login')
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + 'api/auth/send-verify-otp')

      if(data.success) {
        navigate('/verify-account')
        toast.success(data.message)
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
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const  data  = await axios.post(backendUrl + 'api/auth/logout')
      data.success && setIsLoggedIn(false)
      data.success && setUserInfo(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message, )
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt='Logo' className='w-20 h-20 sm:w-32'/>
      {userInfo ? (<div className='text-center w-8 h-8 flex justify-center items-center group rounded-full text-white relative bg-gray-500 '>
        {userInfo.name[0].toUpperCase()}
        <div className='hidden absolute group-hover:block top-0 right-0 z-10 text-black rounded pt-10 '>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
            {!userInfo.isAccountVerified && 
            <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>

            }
            <li onClick={handleLogout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10' >Logout</li>
          </ul>
        </div>
      </div>
      ): (
      <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all' onClick={handleClick}>Login<FaArrowRightLong/></button>
      )}
      </div>
  )
}

export default Header