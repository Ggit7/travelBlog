import React, { useState } from 'react'
import PasswoardInput from '../../component/Input/PasswoardInput'
import { useNavigate } from "react-router-dom"
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
export default function Registration() {

  const [email, setEmail] = useState("");
  const [fullName, setFullName]=useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handelRegistration = async (e) => {
    e.preventDefault();
    if(!fullName){
      setError('please enter your full name')
      return;
    }

    if (!email) {
      setError("please enter a email")
      return;
    }
    if (!validateEmail(email)) {
      setError("please enter a valid email ")
      return;
    }
    if(!password){
      setError('enter a passwoard')
      return;
    }
    
    setError(' ');
    try{
      const response=await axiosInstance.post('/registration',{
        fullName: fullName,
        email: email,
        password: password,
      });

      if(response.data){
        navigate('/login');
      }
    } catch(error){

      if(
        error.response &&
        error.response.data && 
        error.response.data.message
      ){
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative flex items-center justify-center">
    {/* Decorative Elements */}
    <div className="absolute w-40 h-40 bg-cyan-300 rounded-full right-10 -top-20 md:w-56 md:h-56 lg:w-72 lg:h-72" />
    <div className="absolute w-40 h-40 bg-cyan-200 rounded-full -bottom-20 right-1/2 transform translate-x-1/2 md:w-56 md:h-56 lg:w-72 lg:h-72" />
  
    {/* Main Container */}
    <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 md:px-10 space-y-8 md:space-y-0">
      {/* Left Section - Background Image */}
      <div className="hidden md:flex w-full md:w-1/2 h-[90vh] bg-login-bg-img bg-cover bg-center rounded-lg"></div>
  
      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 bg-white rounded-lg p-8 md:p-16 shadow-lg shadow-cyan-200/50">
        <form onSubmit={handelRegistration} className="space-y-4">
          <h4 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Signup</h4>
  
          {/* Full Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
          />
  
          {/* Email Input */}
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
  
          {/* Password Input */}
          <PasswoardInput
            value={password}
            onchange={({ target }) => setPassword(target.value)}
          />
  
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
  
          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
          >
            SIGNUP
          </button>
  
          {/* Divider */}
          <p className="text-sm text-gray-500 text-center my-4">Already registered?</p>
  
          {/* Signin Button */}
          <button
            type="button"
            className="w-full bg-gray-100 text-cyan-500 py-2 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigate('/login')}
          >
            SIGNIN
          </button>
        </form>
      </div>
    </div>
  </div>
  )  
}
