import React from 'react'
import Logo from '@/common/components/atoms/Logo/Logo'
import { LayoutGrid, Calendar, Map, BookOpen, Bell, HelpCircle, ChevronLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import LogoutButton from './LogoutButton'


const SideNavbar = () => {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const { data: session } = useSession()

    const router = useRouter()
    const pathname = usePathname()

    const fullName = session?.user?.fullName || 'Guest'
    const firstName = fullName.split(' ')[0]

    const initial = firstName.charAt(0).toUpperCase()

    const MainNavItems = [
        { name: 'Home', tab : 'home' , icon: LayoutGrid },
        { name: 'Schedule', tab : 'schedule' ,icon: Calendar },
        // { name: 'Analytics', tab : 'analytics' , icon: BarChart3 },
        { name: 'Trips', tab : 'trips' , icon: Map },
        { name: 'Bookings', tab : 'bookings' , icon: BookOpen },
        { name : 'Discounts', tab : 'discounts' , icon: Map } ,
    ]

    const SecondaryNavItems = [
        { name: 'Profile',tab : 'profile' , icon: Bell },
        // { name: 'Settings', tab : 'settings' , icon: HelpCircle },
        { name: 'Help', tab : 'help' , icon: HelpCircle },
    ]

    return (
        <div className='flex flex-col justify-between max-h-screen h-full transition-all duration-300 ease-in-out'>
            <div className='flex justify-between items-center'>
                <Logo className='mx-2 transition-all duration-300 ease-in-out overflow-hidden' isCollapsed={isCollapsed} />
                <div className='border-2 border-[#E2E8F0] bg-white rounded-full p-1 translate-x-[50%] cursor-pointer transition-all duration-300 ease-in-out' onClick={() => setIsCollapsed(!isCollapsed)}>
                    <ChevronLeft className={isCollapsed ? 'rotate-180' : ''} size={20} />
                </div>
            </div>
            <div className='flex flex-col justify-between h-full'>
                <div>
                    {
                        MainNavItems.map((item) => {
                            const isActive = item.tab === 'home' ? pathname === '/dashboard/home' : pathname.startsWith(`/dashboard/${item.tab}`)
                            return (
                            <div key={item.name}>
                                <div
                                    className={`text-[#64748B] flex items-center py-3   ${isCollapsed ? 'justify-center mx-2' : 'mx-4 px-6'} hover:bg-primary hover:text-white cursor-pointer my-1 rounded-xl transition-all duration-300 ease-in-out ${isActive ? 'bg-primary text-white' : ''}`}
                                    onClick={() => router.push(`/dashboard/${item.tab}`)}
                                >
                                    <item.icon className="inline transition-all duration-300 ease-in-out" size={'18'} />
                                    {!isCollapsed && <span className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap w-auto opacity-100}`}>{item.name}</span>}
                                </div>
                            </div>
                            )
                        })
                    }
                    <div className={`w-full border border-[#E2E8F0] my-4`}></div>
                    {
                        SecondaryNavItems.map((item) => {
                            const isActive = item.tab === 'home' ? pathname === '/dashboard' : pathname.startsWith(`/dashboard/${item.tab}`)
                            return (
                            <div
                                key={item.name}
                                className={`text-[#64748B] flex items-center py-3  ${isCollapsed ? 'justify-center mx-2' : 'mx-4 px-6'} hover:bg-primary hover:text-white my-1 cursor-pointer  rounded-xl transition-all duration-300 ease-in-out ${isActive ? 'bg-primary text-white' : ''}`}
                                onClick={() => router.push(`/dashboard/${item.tab}`)}
                            >
                                <item.icon className="inline transition-all duration-300 ease-in-out" size={'18'} />
                                {!isCollapsed && <span className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap w-auto opacity-100`}>{item.name}</span>}
                            </div>
                            )
                        })
                    }
                </div>
                <div>
                <div className={`flex justify-center items-center gap-4 ${isCollapsed ? 'px-0' : 'px-4'} py-2 transition-all duration-300 ease-in-out`}>
                    <LogoutButton isCollapsed={isCollapsed}/>
                </div>
                <div className={`flex justify-center items-center gap-4 ${isCollapsed ? 'px-0' : 'px-4'} pb-2 border-t-2 pt-3 border-[#E2E8F0] transition-all duration-300 ease-in-out`}>
                    <p className='bg-amber-300 rounded-full w-10 h-10 transition-all duration-300 ease-in-out flex items-center justify-center'>{initial}</p>
                    {!isCollapsed && <div className={`transition-all duration-300 ease-in-out overflow-hidden w-auto opacity-100`}>
                        <p className='text-[#64748B] whitespace-nowrap text-sm'>Welcome back</p>
                        <p className='whitespace-nowrap'>{firstName}</p>
                    </div>}
                </div>
                </div>
            </div>

        </div>
    )
}

export default SideNavbar