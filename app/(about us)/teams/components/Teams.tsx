import React from 'react'
import Card from './Card'

export default function Teams() {
  return (
    <div className='bg-white py-16 px-[10%]'> 
        <p className='text-4xl text-black pb-8 font-serif font-semibold'>Our Visionaries</p>
        <div className='lg:flex font-serif gap-8'>
            <Card image={'/assets/team1.png'} title={'Founder'} name={'Gboyega Fred'}/>
            <Card image={'/assets/team2.png'} title={'Founder'} name={'Gboyega Fred'}/>
            <Card image={'/assets/team3.png'} title={'Founder'} name={'Gboyega Fred'}/>
        </div>
    </div>
  )
}
