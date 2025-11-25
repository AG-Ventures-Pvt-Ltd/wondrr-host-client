'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TripForm from './TripForm'
import { Button } from '@/common/ui/button'
import { ArrowLeft } from 'lucide-react'

const Trips = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'list'

  const handleBackToList = () => {
    router.push('?tab=Trips&view=list')
  }

  // Show trip creation form
  if (view === 'create') {
    return (
      <div className='flex flex-col h-full bg-gray-50'>
        <div className='bg-white border-b px-6 py-4'>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackToList}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trips
          </Button>
          <div>
            <h1 className='text-2xl font-semibold'>Create New Trip</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Fill in the details to create an amazing trip experience
            </p>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto'>
          <TripForm 
            onCancel={handleBackToList}
            onSuccess={handleBackToList}
          />
        </div>
      </div>
    )
  }

  // Show trips list
  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center w-full p-6 border-b'>
        <div>
          <h1 className='text-2xl font-semibold'>My Trips</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage and view your adventure trips
          </p>
        </div>
      </div>
      <div className='flex-1 p-6'>
        <div className='flex items-center justify-center h-full text-muted-foreground'>
          <div className='text-center'>
            <p className='text-lg mb-2'>No trips yet</p>
            <p className='text-sm'>Use the &quot;Create Trip&quot; button to get started!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trips