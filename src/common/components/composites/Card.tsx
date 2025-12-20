import React from 'react'

interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div className={`p-6 rounded-xl border border-[rgba(229,229,229,0.6)] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] ${className}`}>
            {children}
        </div>
    )
}

export default Card