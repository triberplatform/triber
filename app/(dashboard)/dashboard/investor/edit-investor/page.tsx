'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function page() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
  return (
    <div>page: {id} </div>
  )
}
