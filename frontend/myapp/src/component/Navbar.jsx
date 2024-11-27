import React from 'react'
import Profile from './Cards/Profile'
import {useNavigate} from 'react-router-dom'
export default function Navbar({user}) {
const navigate=useNavigate();
const isToken= localStorage.getItem('token');
    const onLogout =()=>{
        localStorage.clear();
        navigate('/login')
    }
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow top-0 z-10'>
      <h1 className='bg-cyan-300 rounded px-5 text-red-300 text-xl'>travel Blog</h1>
      {isToken && <Profile user={user} onLogout ={onLogout }/>}
    </div>
  )
}
