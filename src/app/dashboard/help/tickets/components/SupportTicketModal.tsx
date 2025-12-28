import React, { useState } from 'react'
import Modal from '@/common/components/composites/Modal'
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import usePostData from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import SuccessModal from '@/common/components/modals/SuccessModal'
import { SUPPORT_CATEGORIES } from '../constants'

interface SupportTicketModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ open, onClose, onSuccess }) => {
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [successModalOpen, setSuccessModalOpen] = useState(false)

    const { mutate, isPending } = usePostData({
        url: API_ENDPOINTS.SUPPORT.CREATE_TICKET,
        onSuccess: () => {
            setSuccessModalOpen(true)
            onClose()
            onSuccess?.()
        }
    })

    const handleSubmit = () => {
        if (!category || !description) return
        mutate({ type: category, description })
    }

    const handleFormClose = () => {
        setCategory('')
        setDescription('')
        onClose()
    }

    return (
        <>
            <Modal 
                open={open} 
                onClose={handleFormClose}
                title="Raise a Support Ticket"
                description="Describe the issue you're facing with the dashboard and our team will help you resolve it."
                submitText={isPending ? "Submitting..." : "Submit Ticket"}
                onSubmit={handleSubmit}
                disabled={isPending}
            >
                <div className='flex flex-col gap-4'>
                    <FormControl fullWidth required className="mb-4" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}>
                        <InputLabel>Choose Category</InputLabel>
                        <Select
                            value={category}
                            label="Choose Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {SUPPORT_CATEGORIES.map((item) => (
                                <MenuItem value={item} key={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="What happened?" required multiline rows={6} fullWidth className="mb-1" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe the issue in detail. Include any error messages or steps to reproduce the problem." />
                </div>
                <div className="text-xs text-subtext my-2 ml-2">*Provide as much detail as possible to help us resolve your issue quickly</div>
            </Modal>
            <SuccessModal 
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Ticket Raised Successfully"
                description="We will contact you and solve your issue ASAP."
            />
        </>
    )
}

export default SupportTicketModal
