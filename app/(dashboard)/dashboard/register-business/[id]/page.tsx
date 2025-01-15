'use client'
import EditBusiness from '@/app/components/dashboard/EditBusiness'
import { useParams } from 'next/navigation';
import React from 'react'

export default function Page() {
    const { id } = useParams() as { id: string }; // Extract the dynamic ID from the route and assert it as a string
  return (
    <div><EditBusiness id={id}/></div>
  )
}
 