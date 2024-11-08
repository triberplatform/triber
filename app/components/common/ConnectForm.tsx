import React from 'react'

export default function ConnectForm() {
  return (
    <div className='pt-16 pb-28 px-5 lg:px-[10%] map-bg'> 
        <p className='lg:text-4xl text-3xl font-semibold mb-2  font-serif'>Connect Directly with our Partners</p>
        <p className='font-serif'>Need Assistance? We’re Here to Help</p>
        <div>
            <form action="" className='flex-col flex gap-3 mt-7 font-serif'>
                
                <label htmlFor="businessName" className='font-sansSerif text-sm'>Business Name</label>
                <input type="text" placeholder='Enter Registered Business Name' className='lg:w-[60%] text-black py-3 rounded px-5 focus:outline-none focus:ring-0 '/>
                <label htmlFor="businessName" className='font-sansSerif text-sm'>Business Location</label>
                <input type="text" placeholder='Select Company Type' className='lg:w-[60%] text-black py-3 rounded px-5 focus:outline-none focus:ring-0 '/>
                <label htmlFor="businessName" className='font-sansSerif text-sm'>Annual Turnover</label>
                <input type="text" placeholder='Annual Turnover' className='lg:w-[60%] text-black py-3 rounded px-5 focus:outline-none focus:ring-0 '/>
                <label htmlFor="businessName" className='font-sansSerif text-sm'>Funding Requirement</label>
                <input type="text" placeholder='Enter Registered Business Name' className='lg:w-[60%] text-black py-3 rounded px-5 focus:outline-none focus:ring-0 '/>
                <label htmlFor="businessName" className='font-sansSerif text-sm'>Purpose</label>
                <textarea rows={4}  placeholder='Enter Registered Business Name' className='lg:w-[60%] text-black py-3 rounded px-5 focus:outline-none focus:ring-0 '/>
                <button type='submit' className=' bg-mainGreen px-7 py-2 mt-7 rounded-lg text-sm w-32'>Apply</button>
            </form>
        </div>
    </div>
  )
}
