import Navbar from '@/app/components/common/Navbar'
import ConfirmEmailForm from '@/app/components/dashboard/ConfirmEmailForm'
import React from 'react'

export default function page() {
  return (
    <div>
         <Navbar />
      <div className="text-center flex flex-col items-center justify-center">
        <p className="font-semibold text-3xl font-serif">Email Confirmation</p>
        <p className="font-serif">A mail has been sent to you</p>
       <ConfirmEmailForm/>
      </div>
    </div>
  )
}
