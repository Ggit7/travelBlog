import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
export default function PasswoardInput({value, onchange, placeholder}) {
 const [isShowPassword, setIShowPassword] = useState(false);
 
 const togglePassword =()=>{
    setIShowPassword(!isShowPassword)
 }
    return (
    <div className='flex items-center bg-cyan-600/5 px-5 rounded mb-3'>
      <input
      value={value}
      onChange={onchange}
      placeholder={placeholder||"password"}
      type={isShowPassword ? 'text':'password'}
      className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
      />
      {isShowPassword ?(
      <FaRegEye
      size={22}
      className='text-primary cursor-pointer '
      onClick={()=>togglePassword()}
      />
      ):(
        <FaRegEyeSlash
        size={22}
        className='text-primary cursor-pointer '
        onClick={()=>togglePassword()}
        />
      )
}
    </div>
  )
}
