import React from 'react'
import Card from '@/common/components/composites/Card'

const FAQ = () => {
    const faqItems = [
        {
            question: "How do I create a new trip?",
            answer: "Go to the 'My Trips' section and click on 'Create New Trip'. Fill in the details and publish it."
        },
        {
            question: "How can I track my bookings?",
            answer: "Visit the 'Bookings' tab to see all your trip bookings and their statuses."
        },
        {
            question: "What should I do if I face an issue?",
            answer: "Raise a support ticket from the 'Help' section or email us at support@wondrr.in."
        },
        {
            question: "How do reimbursements work?",
            answer: "Submit your expense details, and we'll process the reimbursement within 7-10 business days."
        }
    ]

    return (
        <Card>
            <h2 className='text-maintext mb-4 text-xl font-semibold'>Frequently Asked Questions</h2>
            <div className='flex flex-col gap-4 '>
                {faqItems.map((item, index) => (
                    <div key={index} className={`${index < faqItems.length - 1 ? 'border-b border-[#E5E5E599] pb-5' : ''}`}>
                        <h3 className='text-maintext font-normal'>{item.question}</h3>
                        <p className='text-subtext mt-1 font-normal'>{item.answer}</p>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default FAQ