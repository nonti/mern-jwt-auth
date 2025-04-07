import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-300 to-slate-500'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home