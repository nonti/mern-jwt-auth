import React, { useContext } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext.jsx';
const Header = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);

  return (
    <div className='flex items-center flex-col mt-20 px-4 text-center text-gray-800'>
      <img src={assets.headerImg} alt='logo' className='w-36 h-36 mb-6 rounded-full' onClick={() => navigate('/')}/>
      <h1 className='flex gap-2 text-xl sm:text-3xl font-medium mb-2 items-center '>Hey { userInfo ? userInfo.name : 'Developer'}!
        <img className='w-8 aspect-square animate-wiggle' src={assets.handWave}/></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to auth app</h2>
      <p className='mb-8 max-w-md'>You can use this app to get all the information about the developer</p>
      <button className='border border-gray-400 bg-slate-50 rounded-full px-8 py-2.5 hover:bg-slate-500 transition-all'>Get started</button>
    </div>
  )
}

export default Header
