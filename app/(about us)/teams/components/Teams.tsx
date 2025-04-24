import React from 'react'
import Card from './Card'

export default function Teams() {
  return (
    <div className='bg-white py-16 px-[10%]'> 
        <p className='text-4xl text-black pb-3 font-serif font-semibold'>Our Visionaries</p>
        <p className='text-black mb-4 lg:w-[40%] text-sm'>In 2021, we set out on a mission fueled by a simple yet powerful belief: that small businesses are the backbone of the global economy, but too often left behind in access to scale-up funding and resources</p>
        <div className='lg:flex font-serif gap-8'>
            <Card image={'/assets/team1.png'} title={'Founder'} name={'Makinde Obed'}/>
            <Card image={'/assets/team2.png'} title={'Founder'} name={'Temilola Adesola'}/>
            <Card image={'/assets/team3.png'} title={'Founder'} name={'Omokhafe Dirisu'}/>
        </div>
    </div>
  )
}
