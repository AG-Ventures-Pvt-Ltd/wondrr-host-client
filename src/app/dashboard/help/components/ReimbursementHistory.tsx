import React from 'react'
import Card from '@/common/components/composites/Card'
import { TrendingUp, CircleCheck, Calendar } from 'lucide-react'

const ReimbursementHistory = () => {
    const reimbursementHistory = [
        {
            title: "Manali Winter Wonderland - Dec 24",
            status: "Completed",
            id: "RMB-001",
            requestedDate: "Dec 15, 2024",
            completedDate: "Dec 20, 2024",
            startedProcessingDate: "Dec 18, 2024",
            amount: 96000,
            processedDate: "Dec 22, 2024"
        },
        {
            title: "Goa Beach Retreat - Jan 25",
            status: "Processing",
            id: "RMB-002",
            requestedDate: "Jan 10, 2025",
            completedDate: null,
            startedProcessingDate: "Jan 12, 2025",
            amount: 75000,
            processedDate: null
        },
        {
            title: "Kerala Backwaters - Feb 25",
            status: "Pending",
            id: "RMB-003",
            requestedDate: "Feb 5, 2025",
            completedDate: null,
            startedProcessingDate: null,
            amount: 85000,
            processedDate: null
        }
    ]

    return (
        <Card>
            <div className='flex justify-between'>
                <div>
                    <h2 className='text-maintext text-xl font-semibold mb-1'>Payment Reimbursement History</h2>
                    <p className='text-subtext text-sm'>Track all your reimbursements from Wondrr</p>
                </div>
                <div className='text-success bg-success-bg flex items-center gap-2 py-1 px-3 rounded-lg'>
                    <TrendingUp />
                    <span>₹348,000 Total</span>
                </div>
            </div>
            <div className='flex flex-col gap-3 mt-6'>
                {reimbursementHistory.map((item) => (
                    <div key={item.id} className='flex justify-between bg-[#FAFAFA80] border border-[#E5E5E580] p-4 rounded-xl'>
                        <div>
                            <div className='flex items-center gap-3'>
                                <h3>{item.title}</h3>
                                <p className={`text-${item.status === 'Completed' ? 'success' : item.status === 'Processing' ? 'primary' : 'warning'} bg-${item.status === 'Completed' ? 'success' : item.status === 'Processing' ? 'primary' : 'warning'}-bg px-2 py-1 rounded-xl text-xs`}>{item.status}</p>
                            </div>
                            <p className='text-sm text-subtext mt-1'>ID: {item.id}</p>
                            <div className='flex text-sm text-subtext mt-2 gap-4'>
                                <span className='flex items-center gap-1'><Calendar size={14} />Requested on: {item.requestedDate}</span>
                                {item.status === 'Completed' && item.completedDate && <span className='flex items-center gap-1'><CircleCheck size={14} className='text-success' />Completed on: {item.completedDate}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col items-end justify-center'>
                            <h3 className='text-maintext'>₹{item.amount.toLocaleString()}</h3>
                            {item.status === 'Completed' ? (
                                item.processedDate && <p className='text-sm text-subtext'>Processed on {item.processedDate}</p>
                            ) : (
                                item.startedProcessingDate && <p className='text-sm text-subtext'>Started processing on {item.startedProcessingDate}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default ReimbursementHistory