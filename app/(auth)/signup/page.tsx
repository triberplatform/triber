import Navbar from '@/app/components/common/Navbar'
import SignUpForm from '@/app/components/dashboard/SignUpForm'
import React from 'react'

export default function page() {
  return (
    <>
    <Navbar />
    <div className="text-center flex flex-col items-center justify-center">
      <p className="font-semibold text-3xl font-serif">Become a Triber</p>
      <p className="font-serif">Get started by signing up</p>
    
    <SignUpForm/>
    </div>
  </>
  )
}
