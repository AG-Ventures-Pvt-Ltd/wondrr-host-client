import React from 'react'
import Card from '../../../common/components/composites/Card'
import { TrendingUp, TrendingDown, Calendar, ArrowRight, Users, Sparkles } from 'lucide-react'
import { formatDate } from '../../../common/utils/dateUtils'
import Button from '@/common/components/atoms/Button'


const Home = () => {
    return (
        <div>
            <div>
                <h1 className='text-lg'>Hi, Asep 👋</h1>
                <p className='mt-1 text-sm text-subtext'>Here&apos;s what&apos;s happening with your trips today</p>
            </div>
            <div className='flex justify-between gap-5 mt-8'>
                {[{
                    title: 'Total Revenue',
                    stat: '₹12,45,000',
                    stat_description: "+12.5%",
                    direction: "up"
                }, {
                    title: 'Active Trips',
                    stat: '0',
                    stat_description: "+3 this month",
                    direction: "up"
                }, {
                    title: 'Total Bookings',
                    stat: '0',
                    stat_description: "+18 this week",
                    direction: "down"
                },
                {
                    title: 'Avg. Occupany',
                    stat: '78%',
                    stat_description: "+5.2%",
                    direction: "up"
                }
                ].map((item) => (
                    <Card key={item.title} className="p-6 flex-1">
                        <div className='flex justify-between '>
                            <div className='flex flex-col gap-3'>
                                <div>
                                    <h2 className='text-sm text-subtext'>{item.title}</h2>
                                    <p className='mt-2 text-3xl'>{item.stat}</p>
                                </div>
                                <p className={`${item.direction === "up" ? 'text-success' : 'text-warning'} mt-1 text-sm font-normal`}>
                                    {item.stat_description}
                                </p>
                            </div>
                            <div>
                                {item.direction === "up" ? <TrendingUp className='text-success bg-success-bg p-1 rounded-lg' size={28} /> : <TrendingDown className='text-warning bg-warning-bg p-1 rounded-lg' size={28} />}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className='flex justify-between gap-5 mt-8'>
                <Card className={'flex-2'}>
                    <div className='flex justify-between mb-6'>
                        <h2 className='text-xl'>Upcoming Trips</h2>
                        <span className='flex items-center gap-2 text-primary'>
                            View All
                            <ArrowRight size={20} />
                        </span>
                    </div>
                    {[{ title: "Rishikesh Adventure", startDate: "2024-04-26", totalBookings: 12, totalSeats: 15, status: "fast-filling" }, { title: "Goa Beach Trip", startDate: "2024-05-10", totalBookings: 8, totalSeats: 20, status: "available" }, { title: "Kerala Backwaters", startDate: "2024-06-15", totalBookings: 15, totalSeats: 18, status: "fast-filling" }, { title: "Himachal Trek", startDate: "2024-07-20", totalBookings: 5, totalSeats: 12, status: "available" }].map((item) =>
                        <Card key={item.title} className={'mt-4 p-4! '}>
                            <div className='flex justify-between'>
                                <div className='flex gap-4'>
                                    <Calendar className='text-primary bg-primary-bg p-3 rounded-2xl' size={48} />
                                    <div>
                                        <h2>{item.title}</h2>
                                        <p className='mt-1 text-sm text-subtext'>{formatDate(item.startDate)}</p>
                                    </div>
                                </div>
                                <div className='flex gap-6 items-center'>
                                    <p className='text-center'>
                                        {item.totalBookings} / {item.totalSeats}<br></br><span className='text-subtext text-sm'>seats</span>
                                    </p>
                                    <p>
                                        {item.status === "fast-filling" ? <span className='text-warning text-sm bg-warning-bg p-2 rounded-lg'>Fast Filling</span> : <span className='text-success text-sm bg-success-bg p-2 rounded-lg'>Available</span>}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </Card>
                <Card className={'flex-1'}>
                    <h2 className='text-xl'>Alerts</h2>

                    <div className={'my-6 border border-[#E5E5E5]'}></div>
                    <div className='mt-4 flex flex-col items-start gap-4'>
                        <p>Quick Actions</p>
                        <Button className='rounded-2xl! whitespace-nowrap w-full justify-start! pl-6!' startIcon={<Sparkles size={20} />} variant={'contained'} >
                           <span className='justify-self-start'>Create new trip</span>
                        </Button>
                        <Button className='rounded-2xl! whitespace-nowrap w-full justify-start! pl-6! text-subtext!' variant={'text'}>
                            <Users className='mr-1' size={20}/> <span>View inquiries</span>
                        </Button>
                    </div>
                </Card>
            </div>
            <Card className={'mt-8'}>
                <div className='flex justify-between mb-6'>
                    <h2 className='text-xl'>Recent Bookings</h2>
                    <span className='flex items-center gap-2 text-primary'>
                        View All
                        <ArrowRight size={20} />
                    </span>
                </div>
                {[{ title: "Rishikesh Adventure", location: "Manali", paidAmount: 4000 }, { title: "Goa Beach Trip", location: "Manali", paidAmount: 3000 }, { title: "Kerala Backwaters", location: "Manali", paidAmount: 6000 }, { title: "Himachal Trek", location: "Manali", paidAmount: 4000 }].map((item) =>
                    <Card key={item.title} className={'mt-4 p-4! '}>
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-4'>
                                <Calendar className='text-primary bg-primary-bg p-3 rounded-2xl' size={48} />
                                <div>
                                    <h2>{item.title}</h2>
                                    <p className='mt-1 text-sm text-subtext'>{item.location}</p>
                                </div>
                            </div>
                            <p className='text-center mr-4'>
                                ₹ {item.paidAmount}
                            </p>
                        </div>
                    </Card>
                )}
            </Card>
        </div>
    )
}

export default Home