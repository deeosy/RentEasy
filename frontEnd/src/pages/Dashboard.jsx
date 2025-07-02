import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SignOutUser } from '../../APIs/api'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const handleLogOut = async () => {
    try {
      await SignOutUser();
      alert("Sign out successfully")
      navigate("/")
    } catch (error) {
      // console.error("Log out error: ", error);
      alert("Log out failed. Please try again.")
    }
  }

  return (
    <div>
      <div className="flex justify-between px-5 py-2">

        <p className='text-3xl' >This is the Dashboard</p>
        <button onClick={handleLogOut} className='cursor-pointer text-xl bg-sky-200 hover:bg-sky-300  rounded-md px-2 py-0.5' >SignOut</button>
      </div>
    </div>
  )
}
