import React from 'react'
import Logo from '@/common/components/atoms/Logo/Logo'
import { LayoutGrid, BarChart3, Calendar, Map, BookOpen, Bell, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'


const SideNavbar = () => {

    const [isCollapsed, setIsCollapsed] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const activeTab = pathname === '/dashboard' ? 'home' : pathname.split('/').pop() || 'home'

    const MainNavItems = [
        { name: 'Home', tab : 'home' , icon: LayoutGrid },
        { name: 'Schedule', tab : 'schedule' ,icon: Calendar },
        { name: 'Analytics', tab : 'analytics' , icon: BarChart3 },
        { name: 'My Trips', tab : 'mytrips' , icon: Map },
        { name: 'Bookings', tab : 'bookings' , icon: BookOpen },
    ]

    const SecondaryNavItems = [
        { name: 'Profile',tab : 'profile' , icon: Bell },
        { name: 'Settings', tab : 'settings' , icon: HelpCircle },
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
                        MainNavItems.map((item) => (
                            <div key={item.name}>
                                <div
                                    className={`text-[#64748B] flex items-center py-3   ${isCollapsed ? 'justify-center mx-2' : 'mx-4 px-6'} hover:bg-primary hover:text-white cursor-pointer my-1 rounded-xl transition-all duration-300 ease-in-out ${item.tab === activeTab ? 'bg-primary text-white' : ''}`}
                                    onClick={() => router.push(`/dashboard/${item.tab}`)}
                                >
                                    <item.icon className="inline transition-all duration-300 ease-in-out" size={'18'} />
                                    {!isCollapsed && <span className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap w-auto opacity-100}`}>{item.name}</span>}
                                </div>
                            </div>
                        ))
                    }
                    <div className={`w-full border border-[#E2E8F0] my-4`}></div>
                    {
                        SecondaryNavItems.map((item) => (
                            <div
                                key={item.name}
                                className={`text-[#64748B] flex items-center py-3  ${isCollapsed ? 'justify-center mx-2' : 'mx-4 px-6'} hover:bg-primary hover:text-white my-1 cursor-pointer  rounded-xl transition-all duration-300 ease-in-out ${item.tab === activeTab ? 'bg-primary text-white' : ''}`}
                                onClick={() => router.push(`/dashboard/${item.tab}`)}
                            >
                                <item.icon className="inline transition-all duration-300 ease-in-out" size={'18'} />
                                {!isCollapsed && <span className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap w-auto opacity-100`}>{item.name}</span>}
                            </div>
                        ))
                    }
                </div>
                <div className={`flex justify-center items-center gap-4 ${isCollapsed ? 'px-0' : 'px-4'} pb-4 border-t-2 pt-4 border-[#E2E8F0] transition-all duration-300 ease-in-out`}>
                    <p className='bg-amber-300 rounded-full p-3 transition-all duration-300 ease-in-out'>S A</p>
                    {!isCollapsed && <div className={`transition-all duration-300 ease-in-out overflow-hidden w-auto opacity-100`}>
                        <p className='text-[#64748B] whitespace-nowrap text-sm'>Welcome back</p>
                        <p className='whitespace-nowrap'>Shreyansh</p>
                    </div>}
                    {!isCollapsed && <ChevronRight className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`} />}
                </div>
            </div>

        </div>
    )
}

export default SideNavbar