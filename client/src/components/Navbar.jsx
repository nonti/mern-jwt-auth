import React from 'react'
import { assets } from '../assets/assets'
import { FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt='Logo' className='w-20 h-20 sm:w-32'/>
      <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login<FaArrowRightLong/></button>
    </div>
  )
}

export default Header