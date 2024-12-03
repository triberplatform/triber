import React from 'react'

export default function ListBusiness() {
  return (
    <div className='bg-mainBlack p-4 rounded-xl font-serif'>
        <p className="text-xl">Business Profiles Created</p>
        <div className='flex flex-col justify-center items-center text-center py-28'>
            <p className="w-52 text-sm mb-5">Your business will appear here. Create a business to get started</p>
            <button className="bg-black text-white rounded py-3 px-4">Add Business</button>
        </div>
    </div>
  )
}
