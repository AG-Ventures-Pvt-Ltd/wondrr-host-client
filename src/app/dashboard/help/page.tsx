'use client'

import React from 'react'
import HelpHeader from './components/HelpHeader'
import HelpCards from './components/HelpCards'
import ReimbursementHistory from './components/ReimbursementHistory'
import FAQ from './components/FAQ'
import ContactSupport from './components/ContactSupport'

const Help = () => {
    return (
        <div className='flex flex-col gap-8'>
            <HelpHeader />
            <HelpCards />
            <ReimbursementHistory />
            <FAQ />
            <ContactSupport />
        </div>
    )
}

export default Help