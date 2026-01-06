import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { signOut } from "next-auth/react";
import Button from '@/common/components/atoms/Button';
import { logError } from '@/common/utils/logError';
import Modal from '@/common/components/composites/Modal';

interface LogoutButtonProps {
    isCollapsed: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isCollapsed }) => {

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleLogOut = () => {
        setConfirmModalOpen(true);
    }

    const confirmLogout = async () => {
        try {
            await signOut({ callbackUrl: "/auth" })
        } catch (error) {
            logError({error: error, location : "src/app/dashboard/components/LogoutButton.tsx" , when : "during logout"})
        }
    }
    return (
        <>
            <Button
                className={`text-[#64748B] flex items-center py-2 px-4 ${isCollapsed ? 'justify-center' : 'w-full'} hover:bg-red-50! hover:text-red-600! hover:border-red-600! cursor-pointer rounded-xl transition-all duration-300 ease-in-out`}
                onClick={handleLogOut}
                variant='outlined'
            >
                <LogOut className="inline transition-all duration-300 ease-in-out" size={'16'} />
                {!isCollapsed && <span className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap w-auto opacity-100`}>Logout</span>}
            </Button>
            <Modal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title="Confirm Logout"
                description="Are you sure you want to logout?"
                submitText="Logout"
                onSubmit={confirmLogout}
            />
        </>
)
}

export default LogoutButton