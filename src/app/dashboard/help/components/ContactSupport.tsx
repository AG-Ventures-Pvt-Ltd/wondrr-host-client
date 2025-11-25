import React from 'react'
import Card from '@/common/components/composites/Card'
import { HelpCircle, Mail, Phone } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/common/constants/contactInfo'

const ContactSupport = () => {
    return (
        <Card className='text-center py-8'>
            <div className='flex flex-col items-center gap-4'>
                <HelpCircle size={68} className='text-primary bg-primary-bg rounded-full p-3' />
                <h2 className='text-maintext text-xl font-semibold'>Still need help?</h2>
                <p className='text-subtext'>Our support team is here to assist you with any questions</p>
                <div className='flex gap-4'>
                    <Button startIcon={<Mail size={20} />} variant="contained" className='rounded-2xl! px-5!'>
                        {SUPPORT_EMAIL}
                    </Button>
                    <Button startIcon={<Phone size={20} />} variant="text" className='rounded-2xl! px-5!'>
                        {SUPPORT_PHONE}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default ContactSupport