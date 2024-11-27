import React, { useState } from 'react'
import PasswoardInput from '../../component/Input/PasswoardInput'
import { useNavigate } from "react-router-dom"
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handelLogin = async (e) => {
    e.preventDefault();
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
      const response=await axiosInstance.post('/login',{

        email: email,
        password: password,
      });

      if(response.data && response.data.accessToken){
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userId',response.data.user.userID);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/');
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
      {/* Decorative boxes */}
      <div className="absolute w-40 h-40 bg-cyan-300 rounded-full right-10 -top-20 md:w-56 md:h-56 lg:w-72 lg:h-72" />
      <div className="absolute w-40 h-40 bg-cyan-200 rounded-full -bottom-20 right-1/2 transform translate-x-1/2 md:w-56 md:h-56 lg:w-72 lg:h-72" />
  
      {/* Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 md:px-10">
        
        {/* Left section (background image) */}
        <div className="hidden md:flex w-full md:w-1/2 h-[90vh] bg-login-bg-img bg-cover bg-center rounded-lg"></div>
  
        {/* Right section (form) */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-8 md:p-16 shadow-lg shadow-cyan-200/50">
          <form onSubmit={handelLogin} className="space-y-4">
            <h4 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h4>
            
            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 bg-slate-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
  
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
            >
              LOGIN
            </button>
  
            {/* Divider */}
            <p className="text-sm text-gray-500 text-center my-4">or</p>
  
            {/* Signup Button */}
            <button
              type="button"
              className="w-full bg-gray-100 text-cyan-500 py-2 rounded-lg hover:bg-gray-200 transition"
              onClick={() => navigate('/registration')}
            >
              SIGNUP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}
