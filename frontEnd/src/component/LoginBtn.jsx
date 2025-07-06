import React from 'react';

export default function LoginBtn({ isFormValid }) {
    return (
        <button 
            type='submit' 
            className={`bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap w-fit cursor-pointer hover:border-1 transition-all duration-100 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={!isFormValid}
        >
            Login
        </button>
    );
}