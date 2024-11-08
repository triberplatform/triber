import LandingLayout from '@/app/components/layouts/landingLayout'
import React from 'react'
import Hero from './components/Hero'
import ImageGrid from './components/ImageGrid'
import Photos from '@/app/components/common/PhotoGallery'

export default function page() {
  return (
    <LandingLayout>
        <Hero/>
        <ImageGrid/>
        <Photos/>
    </LandingLayout>
  )
}
