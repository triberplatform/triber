import DashboardWrapper from '@/app/components/dashboard/DashboardWrapper'
import config from '@/app/config/config'
import React from 'react'


export default function page() {
    console.log(config.apiUrl)
    
  return (
    <div>
        <DashboardWrapper/>
        
    </div>
  )
}
