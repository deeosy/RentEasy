import React from 'react'
import SignUpBtn from '../component/SignUpBtn'
import { useForm } from 'react-hook-form'
import googleIcon from '../icons/google.png'
import facebookIcon from '../icons/facebook.png'
import usePropertyStore from '../store/usePropertyStore'
import { data, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function SignUpPage({ checkAuth }) {
    const { signUp } = usePropertyStore()
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const navigate = useNavigate();


    const onSubmit = async () => {
        try {
            await signUp(data.username, data.email, data.password);
            await checkAuth();
            toast.success('Signup successful');
            navigate('/properties');
        } catch (err) {
            toast.error('Signup failed: ', err.message);            
        } finally {
            reset();
        }
    }


  return (
    <>
        <h3 className='text-4xl font-bold text-center mb-10' >Sign Up</h3>
        <form action="" method='post' onSubmit={handleSubmit(onSubmit)} 
            className='flex flex-col gap-5 max-w-[440px] mx-auto text-indigo-900 outline-none '
        >
            <div className="flex flex-col">
                <input type="username" name="username" placeholder='User name' {...register("username", {required: "User name is required"})} 
                className='rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none'
                />
                {errors.username && (
                <span className='text-red-500 text-sm' >{errors.username.message || "User name is required"}</span>
                )}
            </div>
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
                <span className='text-red-500 text-sm' >{errors.password.message || "Password is required"}</span>
                )}
            </div>
            <SignUpBtn  />
        </form>
        <div className="mt-3">
            <h3 className='text-center' >Or register with social platforms</h3>
            <div className="flex justify-center mt-3 gap-3 ">
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
