import React from 'react'
import Card from '@/common/components/composites/Card'
import { Book, ArrowRight, Info, Mail, FileText } from 'lucide-react'
import { SUPPORT_EMAIL } from '@/common/constants/contactInfo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Modal from '@/common/components/composites/Modal'
import { Copy } from 'lucide-react'
import { notify } from '@/common/utils/notify'

const HelpCards = () => {

    const router = useRouter()
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    return (
        <div>
            <h3 className='mb-5 text-xl font-semibold text-maintext'>How can we help you?</h3>
            <div className='grid grid-cols-2 gap-5'>
                <Card className='flex justify-between' >
                    <div className='flex gap-4 items-center'>
                        <Book size={44} className='text-primary bg-primary-bg p-2.5 rounded-xl' />
                        <div className='flex flex-col'>
                            <h2 className='text-maintext'>Getting started</h2>
                            <p className='font-normal text-sm text-subtext'>Learn the basics of managing your trips</p>
                        </div>
                    </div>
                    <ArrowRight className='text-subtext' />
                </Card>
                    <Card onClick={() => router.push('/dashboard/help/tickets')} className='cursor-pointer flex justify-between'>
                        <div className='flex gap-4 items-center'>
                            <Info size={44} className='text-success bg-success-bg p-2.5 rounded-xl' />
                            <div className='flex flex-col'>
                                <h2 className='text-maintext'>Raise Support Ticket</h2>
                                <p className='font-normal text-sm text-subtext'>Report an issue with the dashboard</p>
                            </div>
                        </div>
                        <ArrowRight className='text-subtext' />
                    </Card>
                <Card className='flex justify-between' onClick={() => router.push('/dashboard/help/documentation')}>
                    <div className='flex gap-4 items-center'>
                        <FileText size={44} className='text-[#9810FA] bg-[#FAF5FF] p-2.5 rounded-xl' />
                        <div className='flex flex-col'>
                            <h2 className='text-maintext'>Documentation</h2>
                            <p className='font-normal text-sm text-subtext'>Browse our comprehensive guides</p>
                        </div>
                    </div>
                    <ArrowRight className='text-subtext' />
                </Card>
                <Card className='flex justify-between' onClick={() => setIsEmailModalOpen(true)}>
                    <div className='flex gap-4 items-center'>
                        <Mail size={44} className='text-warning bg-warning-bg p-2.5 rounded-xl' />
                        <div className='flex flex-col'>
                            <h2 className='text-maintext'>Email Us</h2>
                            <p className='font-normal text-sm text-subtext'>Send us an email at {SUPPORT_EMAIL}</p>
                        </div>
                    </div>
                    <ArrowRight className='text-subtext' />
                </Card>
            </div>
            <Modal
                open={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                title="Contact Support"
                description="Send us an email for assistance"
                showButtons={false}
            >
                <div className="flex justify-center gap-2">
                    <span>{SUPPORT_EMAIL}</span>
                    <button onClick={() => {navigator.clipboard.writeText(SUPPORT_EMAIL); notify.success('Email copied to clipboard!');}} className="p-1 hover:bg-gray-100 rounded">
                        <Copy size={14} />
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default HelpCards