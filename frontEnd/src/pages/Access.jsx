// import React from 'react'
import { useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Access({isAuth, setIsAuth, checkAuth}) {
    const [showSignIn, setShowSignIn] = useState(true); // Single state to toggle between login and signup
    const navigate = useNavigate()

    const handleSwitchPages = () => {
        setShowSignIn(!showSignIn);
    };
    
    useEffect(() => {
      if(isAuth){
        navigate("/properties")
      } else {
        navigate("/access")
      }
    }, [isAuth, navigate])


    return (
        <div className="relative m-[5vh] max-w-7xl md:mx-auto rounded-4xl bg-blue-100 h-[78vh] mx-2 overflow-hidden flex flex-col md:flex-row justify-between gap-5">
        <div
            className={`absolute left-0 z-10 bg-blue-300 h-[200%] w-full md:h-full md:w-[200%] rounded-[70px] md:rounded-[150px] flex flex-col md:flex-row justify-between ${
            showSignIn
                ? 'translate-y-[40%] md:translate-x-[25%] md:translate-y-0 transition-all duration-700'
                : '-translate-y-[90%] md:-translate-y-0 md:-translate-x-[75%] transition-all duration-700'
            }`}
        >
            <div className="md:w-[25%] p-3 md:rounded-r-[150px] text-center">
            <h2 className="text-3xl">Welcome Back!</h2>
            <h4>Already have an account?</h4>
            <button
                className="border border-black cursor-pointer px-2 py-1"
                onClick={handleSwitchPages}
            >
                Login
            </button>
            </div>
            <div className="md:w-[25%] p-3 md:rounded-r-[150px] text-center">
            <h2 className="text-3xl">Hello, Welcome!</h2>
            <h4>Don't have an account?</h4>
            <button
                className="border border-black cursor-pointer px-2 py-1"
                onClick={handleSwitchPages}
            >
                Register
            </button>
            </div>
        </div>
        <div
            className={`h-full w-full p-3 my-[100px] text-xl transition-all duration-900 ${
            showSignIn
                ? 'translate-y-0 md:translate-x-0 opacity-100'
                : '-translate-y-[100%] md:translate-x-[100%] opacity-0'
            }`}
        >
            
            <SignUpPage setIsAuth={setIsAuth} checkAuth={checkAuth} />
        </div>
        <div
            className={`h-full w-full p-3 my-[100px] text-xl transition-all duration-900 ${
            showSignIn
                ? 'translate-y-[100%] md:translate-x-[100%] opacity-0'
                : '-translate-y-[126%] md:translate-y-0 md:translate-x-0 opacity-100'
            }`}
        >
            <LoginPage setIsAuth={setIsAuth} checkAuth={checkAuth} />
        </div>
        </div>
    );
 }
