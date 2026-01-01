'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import EmptyTripsCard from './components/EmptyTripsCard'
import Loader from '@/common/components/composites/Loader'
import { useHomeStats } from './hooks/useHomeStats'
import StatsCards from './components/StatsCards'
import UpcomingTrips from './components/UpcomingTrips'
import QuickActions from './components/QuickActions'
import RecentBookings from './components/RecentBookings'


const Home = () => {

    const { data: session } = useSession()
 
    const firstName = session?.user?.fullName?.split(' ')[0] || 'Guest'

    const { statsData, upcomingTrips, hasCreatedTrips, isLoading } = useHomeStats();

    const recentBookings = [
        { title: "Rishikesh Adventure", location: "Manali", paidAmount: 4000 },
        { title: "Goa Beach Trip", location: "Manali", paidAmount: 3000 },
        { title: "Kerala Backwaters", location: "Manali", paidAmount: 6000 },
        { title: "Himachal Trek", location: "Manali", paidAmount: 4000 }
    ];

    if (isLoading) return <Loader />;

    return (
        <div>
            <div>
                <h1 className='text-lg'>Hi, {firstName} 👋</h1>
                <p className='mt-1 text-sm text-subtext'>Here&apos;s what&apos;s happening with your trips today</p>
            </div>
            
            <StatsCards statsData={statsData} />
            
            {!hasCreatedTrips ? (
                <div className='flex justify-center'>
                    <EmptyTripsCard />
                </div>
            ) : (
                <div>
                    <div className='flex justify-between gap-5 mt-8'>
                        <UpcomingTrips trips={upcomingTrips} />
                        <QuickActions />
                    </div>
                    <RecentBookings bookings={recentBookings} />
                </div>
            )}
        </div>
    )
}

export default Home