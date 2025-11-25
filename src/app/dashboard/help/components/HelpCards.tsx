import React, { useState } from 'react'
import Card from '@/common/components/composites/Card'
import Modal from '@/common/components/composites/Modal'
import { Book, ArrowRight, Info, Mail, FileText } from 'lucide-react'
import { SUPPORT_EMAIL } from '@/common/constants/contactInfo'
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const HelpCards = () => {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')

    return (
        <div>
            <h3 className='mb-5 text-xl font-semibold text-maintext'>How can we help you?</h3>
            <div className='grid grid-cols-2 gap-5'>
                <Card className='flex justify-between'>
                    <div className='flex gap-4 items-center'>
                        <Book size={44} className='text-primary bg-primary-bg p-2.5 rounded-xl' />
                        <div className='flex flex-col'>
                            <h2 className='text-maintext'>Getting started</h2>
                            <p className='font-normal text-sm text-subtext'>Learn the basics of managing your trips</p>
                        </div>
                    </div>
                    <ArrowRight className='text-subtext' />
                </Card>
                <div onClick={() => setOpen(true)} className="cursor-pointer">
                    <Card className='flex justify-between'>
                        <div className='flex gap-4 items-center'>
                            <Info size={44} className='text-success bg-success-bg p-2.5 rounded-xl' />
                            <div className='flex flex-col'>
                                <h2 className='text-maintext'>Raise Support Ticket</h2>
                                <p className='font-normal text-sm text-subtext'>Report an issue with the dashboard</p>
                            </div>
                        </div>
                        <ArrowRight className='text-subtext' />
                    </Card>
                </div>
                <Card className='flex justify-between'>
                    <div className='flex gap-4 items-center'>
                        <FileText size={44} className='text-[#9810FA] bg-[#FAF5FF] p-2.5 rounded-xl' />
                        <div className='flex flex-col'>
                            <h2 className='text-maintext'>Documentation</h2>
                            <p className='font-normal text-sm text-subtext'>Browse our comprehensive guides</p>
                        </div>
                    </div>
                    <ArrowRight className='text-subtext' />
                </Card>
                <Card className='flex justify-between'>
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
                open={open} 
                onClose={() => setOpen(false)}
                title="Raise a Support Ticket"
                description="Describe the issue you're facing with the dashboard and our team will help you resolve it."
                submitText="Submit Ticket"
                onSubmit={() => {
                    // Handle submit logic here
                    setOpen(false)
                }}
            >
                <div className='flex flex-col gap-4'>
                    <FormControl fullWidth required className="mb-4" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}>
                        <InputLabel>Choose Category</InputLabel>
                        <Select
                            value={category}
                            label="Choose Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="bug">Bug Report</MenuItem>
                            <MenuItem value="feature">Feature Request</MenuItem>
                            <MenuItem value="general">General Inquiry</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="What happened?" required multiline rows={6} fullWidth className="mb-1" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe the issue in detail. Include any error messages or steps to reproduce the problem." />
                </div>
                <div className="text-xs text-subtext my-2 ml-2">*Provide as much detail as possible to help us resolve your issue quickly</div>
            </Modal>
        </div>
    )
}

export default HelpCards