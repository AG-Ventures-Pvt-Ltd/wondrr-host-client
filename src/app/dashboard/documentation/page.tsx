'use client'

import { useRouter } from 'next/navigation'
import Card from '@/common/components/composites/Card'
import { ArrowLeft, Rocket, MapPin, ClipboardList, DollarSign, Star, HelpCircle, Mail, MessageSquare } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import { DOCUMENTATION_CONSTANTS } from './constants/constants'

const Page = () => {
    const router = useRouter()

    return (
        <div>
            <Button
                onClick={() => router.push('/dashboard/help')}
                variant='text'
                className="flex items-center gap-2 mb-6"
            >
                <ArrowLeft size={16} className='text-subtext' />
                <span className="text-subtext">{DOCUMENTATION_CONSTANTS.NAVIGATION.BACK_TO_HELP}</span>
            </Button>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-maintext">{DOCUMENTATION_CONSTANTS.HEADER.TITLE}</h1>
                <p className="mt-2 text-subtext">{DOCUMENTATION_CONSTANTS.HEADER.SUBTITLE}</p>
            </div>
            <div className="space-y-6 max-w-4xl">
                <Card>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-bg p-2 rounded-lg">
                                <Rocket size={24} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-maintext">{DOCUMENTATION_CONSTANTS.GETTING_STARTED.TITLE}</h2>
                        </div>
                        <p className="mt-2 text-subtext">
                            {DOCUMENTATION_CONSTANTS.GETTING_STARTED.DESCRIPTION}
                        </p>
                    </div>
                    <div className="space-y-4">
                        {DOCUMENTATION_CONSTANTS.GETTING_STARTED.STEPS.map((step, index) => (
                            <div key={index} className='border-l-2 border-l-[#BEDBFF] pl-4'>
                                <p className="font-medium text-maintext">{step.TITLE}</p>
                                <p className="mt-1 text-subtext">
                                    {step.DESCRIPTION}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-bg p-2 rounded-lg">
                                <MapPin size={24} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-maintext">{DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.TITLE}</h2>
                        </div>
                        <p className="mt-2 text-subtext">
                            {DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.DESCRIPTION}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium text-maintext">{DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.DESTINATION_VS_BATCH.TITLE}</p>
                            <p className="mt-1 text-subtext">
                                {DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.DESTINATION_VS_BATCH.DESCRIPTION}
                            </p>
                            <ul className="space-y-1 mt-2 list-disc list-inside text-subtext">
                                {DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.DESTINATION_VS_BATCH.BENEFITS.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='text-primary bg-primary-bg p-4 border border-[#DBEAFE] rounded-2xl'>
                            <p className="mb-2 text-[#1C398E]">{DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.NEW_BATCH.TITLE}</p>
                            <p className="">
                                {DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.NEW_BATCH.DESCRIPTION}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-maintext">{DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.EDITING.TITLE}</p>
                            <p className="mt-1 text-subtext">
                                {DOCUMENTATION_CONSTANTS.MANAGING_TRIPS.EDITING.DESCRIPTION}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-bg p-2 rounded-lg">
                                <ClipboardList size={24} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-maintext">{DOCUMENTATION_CONSTANTS.BOOKINGS.TITLE}</h2>
                        </div>
                        <p className="mt-2 text-subtext">{DOCUMENTATION_CONSTANTS.BOOKINGS.DESCRIPTION}</p>
                    </div>
                    <div>
                        <p className="mb-4 font-medium text-maintext">{DOCUMENTATION_CONSTANTS.BOOKINGS.WORKFLOW_TITLE}</p>
                        <div className="space-y-4">
                            {DOCUMENTATION_CONSTANTS.BOOKINGS.WORKFLOW_STEPS.map((step, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="bg-primary-bg text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">{index + 1}</div>
                                    <div>
                                        <p className="font-medium text-maintext">{step.TITLE}</p>
                                        <p className="mt-1 text-subtext">{step.DESCRIPTION}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-bg p-2 rounded-lg">
                                <DollarSign size={24} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-maintext">{DOCUMENTATION_CONSTANTS.PAYMENTS.TITLE}</h2>
                        </div>
                        <p className="mt-2 text-subtext">{DOCUMENTATION_CONSTANTS.PAYMENTS.DESCRIPTION}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium text-maintext">{DOCUMENTATION_CONSTANTS.PAYMENTS.TIMELINE.TITLE}</p>
                            <p className="mt-1 text-subtext">
                                {DOCUMENTATION_CONSTANTS.PAYMENTS.TIMELINE.DESCRIPTION}
                            </p>
                        </div>
                        <div className='p-4 border border-warning bg-[#FFFBEB] text-[#7B3306] rounded-2xl'>
                            <p className="font-medium">{DOCUMENTATION_CONSTANTS.PAYMENTS.REIMBURSEMENT.TITLE}</p>
                            <p className="mt-1 text-[#BB4D00]">
                                {DOCUMENTATION_CONSTANTS.PAYMENTS.REIMBURSEMENT.DESCRIPTION}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-maintext">{DOCUMENTATION_CONSTANTS.PAYMENTS.FEES.TITLE}</p>
                            <p className="mt-1 text-subtext">
                                {DOCUMENTATION_CONSTANTS.PAYMENTS.FEES.DESCRIPTION}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary-bg p-2 rounded-lg">
                            <Star size={24} className="text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-maintext">{DOCUMENTATION_CONSTANTS.BEST_PRACTICES.TITLE}</h2>
                    </div>
                    <div className="space-y-4">
                        {DOCUMENTATION_CONSTANTS.BEST_PRACTICES.PRACTICES.map((practice, index) => (
                            <div key={index} className='bg-success-bg border border-[#DCFCE7] text-[#0D542B] p-4 rounded-2xl font-normal'>
                                <p className="">{practice.TITLE}</p>
                                <p className="mt-1 text-[#008236]">
                                    {practice.DESCRIPTION}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="bg-primary-bg! p-6 rounded-xl text-center px-[20%] flex items-center flex-col">
                    <div className='w-fit h-fit rounded-full mb-4 p-4 bg-white! shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]!'>
                        <HelpCircle size={36} className="text-primary mx-auto" />
                    </div>
                    <h3 className="text-xl text-maintext mb-2">{DOCUMENTATION_CONSTANTS.HELP_SECTION.TITLE}</h3>
                    <p className="text-subtext">
                        {DOCUMENTATION_CONSTANTS.HELP_SECTION.DESCRIPTION_LINE1}</p>
                    <p className="text-subtext mb-4">
                        {DOCUMENTATION_CONSTANTS.HELP_SECTION.DESCRIPTION_LINE2}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <MessageSquare size={16} />
                            <span>{DOCUMENTATION_CONSTANTS.HELP_SECTION.BUTTONS.SUPPORT_TICKET}</span>
                        </Button>
                        <Button className="flex items-center gap-2 px-4 py-2 text-subtext! border-none! bg-white! shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]!" variant='outlined'>
                            <Mail size={16} />
                            <span>{DOCUMENTATION_CONSTANTS.HELP_SECTION.BUTTONS.EMAIL}</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Page