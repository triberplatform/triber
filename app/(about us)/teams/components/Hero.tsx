import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <div className='text-center mt-3 mb-16 '>
          <p className="lg:text-[3.2rem] text-4xl font-semibold font-serif">Meet Us.</p>
          <p className="my-4 px-5">Triber, we’re more than just a team—we’re a community of innovators, strategists, and <br /> dreamers. Together, we’re building a platform that empowers small businesses to thrive.</p>
          <div className='bg-teams pt-44 lg:pt-56 pb-10 mx-[5%] text-lg font-serif lg:px-16'>
            <p className='lg:text-5xl text-3xl font-serif font-semibold mb-3 lg:mb-5'>Our Journey Began in 2021…</p>
            <div className="flex flex-col gap-2 lg:gap-4 mx-5">
            <p>In 2021, we set out on a mission fueled by a simple yet powerful belief: that small businesses are the backbone of the global economy, but too often left behind in access to scale-up funding and resources</p>
            <p>As of 2023 we have helped raise over NGN 1.28Bn in growth funds for several SMEs.</p>
            <p>We see talented entrepreneurs with brilliant ideas struggling to bring their visions to life, not because they lacked the drive or the creativity, but owing to funding and accelerator barriers that seemed insurmountable, and that’s where we come in.</p>
            </div>
          
          </div>
    </div>
  )
}
