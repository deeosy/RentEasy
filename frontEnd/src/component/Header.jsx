import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-white shadow-sm' >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                    <NavLink to="/" className="flex flex-shrink-0 items-center" >
                        <i className='fas fa-home text-indigo-600 text-2xl mr-2' ></i>
                        <h3 className='text-2xl font-bold flex items-center '><span className='text-xl font-normal'>rent</span>EASY</h3>
                    </NavLink>
                    <nav className='hidden md:ml-8 md:flex md:space-x-8' >
                        <NavLink to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" >Home</NavLink>
                        <NavLink to="/search" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" >Search</NavLink>
                        <NavLink to="/list-property" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" >List Property</NavLink>
                        <NavLink to="/about" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" >About</NavLink>
                    </nav>
                </div>
                <div className="flex items-center">
                    <button className='bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium mr-3 !rounded-button whitespace-nowrap cursor-pointer ' >Log In</button>
                    <button className='bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer ' >Sign Up</button>
                </div>
            </div>
        </div>
    </header>
  )
}
