import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import usePropertyStore from '../store/usePropertyStore';
import defaultImage from '../icons/defaultUser.svg'
import { toast } from 'react-toastify';

export default function Header() {
    const { isAuth, signOut, user } = usePropertyStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown and mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        if (isAuth) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate('/access');
        }
    };

    const handleKeyDown = (event) => {
        if (isAuth && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
            navigate('/');
            toast.success('Logout successful');
        } catch (err) {
            console.error('Logout failed:', err.message);
            toast.error('Failed to log out. Please try again.');
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className='bg-white shadow-sm'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex flex-shrink-0 items-center">
                            <i className='fas fa-home text-indigo-600 text-2xl mr-2'></i>
                            <h3 className='text-2xl font-bold flex items-center'>
                                <span className='text-xl font-normal'>rent</span>EASY
                            </h3>
                        </NavLink>
                        <nav className='hidden md:ml-8 md:flex md:space-x-4 '>
                            <NavLink to="/properties" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Available Properties
                            </NavLink>
                            {isAuth && (
                                <NavLink to="/list-property" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                    List Property
                                </NavLink>
                            )}
                            <NavLink to="/about" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                        {isAuth ? (
                            <>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        onKeyDown={handleKeyDown}
                                        className='flex items-center focus:outline-none'
                                        aria-haspopup="true"
                                        aria-expanded={isDropdownOpen}
                                        aria-label="User menu"
                                    >
                                        <img
                                            src={user?.profileImage || defaultImage}
                                            alt="Profile image"
                                            className='hidden md:block h-11 w-11 cursor-pointer object-cover object-center rounded-full hover:scale-105 transition-transform duration-200'
                                        />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                            <NavLink
                                                to="/properties"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                My Listings
                                            </NavLink>
                                            <NavLink
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Settings
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:flex items-center">
                                    <NavLink to="/list-property">
                                        <button className='bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer ml-3 hover:bg-indigo-700 transition-colors duration-150'>
                                            Post Ad
                                        </button>
                                    </NavLink>
                                </div>
                            </>
                        ) : (
                            !location.pathname.includes('/access') && (
                                <div className="hidden md:flex items-center space-x-2">
                                    <NavLink to="/access?mode=login">
                                        <button className='bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium mr-3 !rounded-button whitespace-nowrap cursor-pointer ' >Log In</button>
                                    </NavLink>
                                    <NavLink to="/access">
                                        <button className='bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors duration-150'>
                                            Sign Up
                                        </button>
                                    </NavLink>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
             {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="flex flex-col p-4 space-y-2">
                        <NavLink
                            to="/properties"
                            className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Available Properties
                        </NavLink>
                        {isAuth && (
                            <>
                                <NavLink
                                    to="/list-property"
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    List Property
                                </NavLink>
                                <NavLink
                                    to="/my-listings"
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Listings
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Settings
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                        <NavLink
                            to="/about"
                            className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </NavLink>
                        {!isAuth && !location.pathname.includes('/access') && (
                            <>
                                <NavLink
                                    to="/access?mode=login"
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </NavLink>
                                <NavLink
                                    to="/access"
                                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}