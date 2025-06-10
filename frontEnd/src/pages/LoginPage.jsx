import React from 'react'
import { useForm } from 'react-hook-form'
import LoginBtn from '../component/loginBtn'
import googleIcon from '../icons/google.png'
import facebookIcon from '../icons/facebook.png'


export default function LoginPage() {
    const {register, handleSubmit, reset, formState: {errors}} = useForm()

    const onSubmit = () => {
    
    }

  return (
    <>
        <h3 className='text-4xl font-bold text-center mb-10' >Login</h3>
        <form action="" method='post' onSubmit={handleSubmit(onSubmit)} 
            className='flex flex-col gap-1.5 max-w-[440px] mx-auto '
        >
            <input type="email" name="email" placeholder='Email' {...register("email", {required: "Email address is required"})} 
              className='rounded-xl bg-gray-300 px-6 py-3 placeholder-sky-700 '
            />
            {errors.email && (
              <span className='text-red-500 text-sm' >{errors.email.message || "Email address is required"}</span>
            )}
            <input type="password" name="password" placeholder='Password' {...register("password", {required: "Password is required"})} 
              className='rounded-xl bg-gray-300 px-6 py-3 placeholder-sky-700'
            />
            {errors.password && (
              <span className='text-red-500 text-sm ' >{errors.password.message || "Password is required"}</span>
            )}
            <LoginBtn />
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
