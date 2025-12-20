import React from 'react'
import { redirect } from 'next/navigation'

const Analytics = () => {
    redirect('/dashboard/home')

    return (
        <div>
            <h1>Analytics</h1>
            <p>This is the analytics page.</p>
        </div>
    )
}

export default Analytics