import React from 'react'
import { useForm } from 'react-hook-form'
import LoginBtn from '../component/loginBtn'
import { Link, useNavigate } from 'react-router-dom';
import googleIcon from '../icons/google.png'
import facebookIcon from '../icons/facebook.png'
import { LoginUser } from '../../APIs/api';
import { useEffect } from 'react';


export default function LoginPage({setIsAuth, checkAuth}) {
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
      try {
          await LoginUser(data.email, data.password)
          await checkAuth(); // re-check authentication status after login
          alert("Check in successfully");
          setIsAuth(true)
          navigate("/properties");          
        } catch (error) {
          setIsAuth(false);
          alert("Check in failed. Please check your credentials")
        } finally{
          reset();
        }
    }



  return (
    <>
        <h3 className='text-4xl font-bold text-center mb-10' >Login</h3>
        <form action="" method='post' onSubmit={handleSubmit(onSubmit)} 
            className='flex flex-col gap-5 max-w-[440px] mx-auto text-indigo-900 '
        >
          <div className="flex flex-col">
              <input type="email" name="email" placeholder='Email' {...register("email", {required: "Email address is required"})} 
                className='rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none'
              />
              {errors.email && (
                <span className='text-red-500 text-sm' >{errors.email.message || "Email address is required"}</span>
              )}
          </div>
          <div className="flex flex-col">
            <input type="password" name="password" placeholder='Password' {...register("password", {required: "Password is required"})} 
              className='rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none'
            />
            {errors.password && (
              <span className='text-red-500 text-sm ' >{errors.password.message || "Password is required"}</span>
            )}
          </div>
            <div className="flex justify-between ">
              <Link to="/reset-password" >
                <h3 className='text-center text-indigo-900 hover:underline' >Forgot Password?</h3>
              </Link>
              <LoginBtn />
            </div>
        </form>
        <div className="mt-7">
            <h3 className='text-center' >Or login with social platforms</h3>
            <div className="flex justify-center mt-5 gap-3 ">
                <button className='cursor-pointer rounded-sm border p-2 ' >
                    <img src={googleIcon} alt="" className='h-6' />
                </button>
                <button className='cursor-pointer rounded-sm border p-2 ' >
                    <img src={facebookIcon} alt="" className='h-6' />
                </button>
            </div>
        </div>
    </>
  )
}
