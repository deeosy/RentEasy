// // import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import LoginBtn from '../component/LoginBtn';
// import googleIcon from '../icons/google.png';
// import facebookIcon from '../icons/facebook.png';
// import usePropertyStore from '../store/usePropertyStore';

// export default function LoginPage({ checkAuth }) {
//     const { login } = usePropertyStore();
//     const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
//     const navigate = useNavigate();

//     const onSubmit = async (data) => {
//         try {
//             await login(data.email, data.password);
//             await checkAuth();
//             toast.success('Login successful');
//             navigate("/properties");
//         } catch (error) {
//             toast.error(`Login failed: ${error.message}. Please check your credentials`);
//         } finally {
//             reset();
//         }
//     };

//     return (
//         <>
//             <h3 className='text-4xl font-bold text-center mb-5 md:mb-10'>Login</h3>
//             <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className='flex flex-col gap-5 text-lg max-w-[440px] mx-auto text-indigo-900'
//             >
//                 <div className="flex flex-col">
//                     <input
//                         type="email"
//                         name="email"
//                         placeholder='Email'
//                         {...register("email", { required: "Email address is required" })}
//                         className='rounded-xl bg-gray-300 px-6 py-2 placeholder-indigo-900 focus:outline-none'
//                     />
//                     {errors.email && (
//                         <span className='text-red-500 text-sm'>{errors.email.message || "Email address is required"}</span>
//                     )}
//                 </div>
//                 <div className="flex flex-col">
//                     <input
//                         type="password"
//                         name="password"
//                         placeholder='Password'
//                         {...register("password", { required: "Password is required" })}
//                         className='rounded-xl bg-gray-300 px-6 py-2 placeholder-indigo-900 focus:outline-none'
//                     />
//                     {errors.password && (
//                         <span className='text-red-500 text-sm'>{errors.password.message || "Password is required"}</span>
//                     )}
//                 </div>
//                 <div className="flex justify-between items-end">
//                     <Link to="/reset-password">
//                         <h3 className='text-center text-indigo-900 hover:underline'>Forgot Password?</h3>
//                     </Link>
//                     <LoginBtn isFormValid={isValid} />
//                 </div>
//             </form>
//             <div className="mt-7 text-lg">
//                 <h3 className='text-center'>Or login with social platforms</h3>
//                 <div className="flex justify-center mt-5 gap-3">
//                     <button className='cursor-pointer rounded-sm border p-2'>
//                         <img src={googleIcon} alt="" className='h-6' />
//                     </button>
//                     <button className='cursor-pointer rounded-sm border p-2'>
//                         <img src={facebookIcon} alt="" className='h-6' />
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginBtn from '../component/LoginBtn';
import googleIcon from '../icons/google.png';
import facebookIcon from '../icons/facebook.png';
import usePropertyStore from '../store/usePropertyStore';

export default function LoginPage({ checkAuth }) {
    const { login } = usePropertyStore();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                toast.success('Login successful', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate("/properties");
            } else {
                toast.error(`Login failed: ${result.message}`, {
                    position: 'top-right',
                    autoClose: 5000,
                });
            }
        } catch (error) {
            toast.error(`Login failed: ${error.message || 'Unexpected error'}`, {
                position: 'top-right',
                autoClose: 5000,
            });
        } finally {
            reset();
        }
    };

    return (
        <>
            <h3 className='text-4xl font-bold text-center mb-5 md:mb-10'>Login</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-5 text-lg max-w-[440px] mx-auto text-indigo-900'
            >
                <div className="flex flex-col">
                    <input
                        type="email"
                        name="email"
                        placeholder='Email'
                        {...register("email", { required: "Email address is required" })}
                        className='rounded-xl bg-gray-300 px-6 py-2 placeholder-indigo-900 focus:outline-none'
                    />
                    {errors.email && (
                        <span className='text-red-500 text-sm'>{errors.email.message || "Email address is required"}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        {...register("password", { required: "Password is required" })}
                        className='rounded-xl bg-gray-300 px-6 py-2 placeholder-indigo-900 focus:outline-none'
                    />
                    {errors.password && (
                        <span className='text-red-500 text-sm'>{errors.password.message || "Password is required"}</span>
                    )}
                </div>
                <div className="flex justify-between items-end">
                    <Link to="/reset-password">
                        <h3 className='text-center text-indigo-900 hover:underline'>Forgot Password?</h3>
                    </Link>
                    <LoginBtn isFormValid={isValid} />
                </div>
            </form>
            <div className="mt-7 text-lg">
                <h3 className='text-center'>Or login with social platforms</h3>
                <div className="flex justify-center mt-5 gap-3">
                    <button className='cursor-pointer rounded-sm border p-2'>
                        <img src={googleIcon} alt="" className='h-6' />
                    </button>
                    <button className='cursor-pointer rounded-sm border p-2'>
                        <img src={facebookIcon} alt="" className='h-6' />
                    </button>
                </div>
            </div>
        </>
    );
}