'use client'

import React from 'react'
import BatchForm from './components/BatchForm'

const BatchCreationPage = () => {
  return (
    <div className="w-full flex flex-col items-center h-full px-20">
      <BatchForm onCancel={() => {}} onSuccess={() => {}} />
    </div>
  )
}

export default BatchCreationPage