import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import usePropertyStore from '../store/usePropertyStore';

export default function Access() {
    const { isAuth, checkAuth } = usePropertyStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSignIn, setShowSignIn] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('mode') === 'login';
    }); 

    useEffect(() => {
       if(isAuth){
           navigate("/properties")
       } 
   }, [isAuth, navigate]);

    const handleSwitchPages = () => {
        setShowSignIn(!showSignIn);
    };
    
    return (
        <div className="relative m-[30px] max-w-7xl md:mx-auto rounded-4xl bg-indigo-300 text-white h-[740px] md:h-[640px] mx-2 overflow-hidden flex flex-col md:flex-row gap-20">
            <div
                className={`absolute left-0 z-10 bg-gradient-to-t from-indigo-700 to-indigo-900 h-[200%] w-full md:h-full md:w-[200%] rounded-[70px] md:rounded-[150px] flex flex-col md:flex-row justify-between ${
                showSignIn
                    ? 'translate-y-[40%] md:translate-x-[25%] md:translate-y-0 transition-all duration-700'
                    : '-translate-y-[90%] md:-translate-y-0 md:-translate-x-[75%] transition-all duration-700'
                }`}
            >
                <div className="md:w-[25%] p-3 md:rounded-r-[150px] text-center">
                <h2 className="text-3xl">Hello, Welcome!</h2>                
                <h4>Don't have an account?</h4>
                <button
                    className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer"
                    onClick={handleSwitchPages}
                >
                    Sign Up
                </button>
                </div>
                <div className="md:w-[25%] p-3 md:rounded-r-[150px] text-center">
                <h2 className="text-3xl">Welcome Back!</h2>
                <h4>Already have an account?</h4>
                <button
                    className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer"
                    onClick={handleSwitchPages}
                >
                    Login
                </button>
                </div>
            </div>
            <div
                className={`h-full w-full p-3 my-[30px] text-xl mb-40  transition-all duration-900 ${
                showSignIn
                    ? 'translate-y-0 md:translate-x-0 opacity-100'
                    : '-translate-y-[100%] md:translate-x-[100%] opacity-0'
                }`}
            >
                <LoginPage checkAuth={checkAuth} />
            </div>
            <div
                className={`h-full w-full p-3 mt-[260px] md:my-[30px] text-xl transition-all duration-900 ${
                showSignIn
                    ? 'translate-y-[100%] md:translate-x-[100%] opacity-0'
                    : '-translate-y-[136%] md:translate-y-0 md:translate-x-0 opacity-100'
                }`}
            >
                <SignUpPage checkAuth={checkAuth} />
            </div>
        </div>
    );
}