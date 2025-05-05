import React from 'react'
import Hero from './components/Hero'
import LandingLayout from '@/app/components/layouts/landingLayout'
import Teams from './components/Teams'
import Sponsors from './components/Sponsors'
import TeamsMobile from './components/TeamsMobile'

export default function page() {
  return (
    <LandingLayout>
        <Hero/>
        {/* <div className='hidden lg:block'>
        <Teams />
        </div>

        <div className='lg:hidden'>
          <TeamsMobile/>
        </div> */}
      
        <Sponsors/>
    </LandingLayout>
  )
}
