import React from 'react'

export default function Success() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <img className="w-56 h-56 rounded-lg mb-4" src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" />
        <h1 className="text-md text-center">Thank You For Purchasing</h1>

        <div className='absolute bottom-10' >
          <h1 className="text-5xl font-bold text-center my-5">VEHWARE</h1>
          <h1 className="text-xs text-center">©2024. All Right Reserved</h1>
        </div>

      </div>

    </>
  )
}
