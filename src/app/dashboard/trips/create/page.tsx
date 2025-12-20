'use client'

import React from 'react'
import TripForm from './components/TripForm'

const CreateTripPage = () => {
    return (
        <div className="w-full flex flex-col items-center h-full px-20">
            <TripForm onCancel={() => { }} onSuccess={() => { }} />
        </div>
    )
}

export default CreateTripPage