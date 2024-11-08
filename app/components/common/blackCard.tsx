import React from 'react'

interface cardProps {
    heading:string,
    body:string
}

export default function BlackCard({heading,body}:cardProps) {
  return (
    <div className='bg-black text-white text-center pt-8 pb-10 rounded-lg px-5 min-h-[250px] col-span-3'>
        <h1 className='text-2xl font-semibold mb-3 font-serif'>{heading}</h1>
        <p>{body}</p>

    </div>
  )
}
