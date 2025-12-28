import React from 'react'

interface CardProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ className, children, onClick }) => {
    const animationClasses = onClick ? 'transition-transform duration-150 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer' : '';
    
    return (
        <div 
            onClick={onClick}
            className={`p-6 rounded-xl border border-[rgba(229,229,229,0.6)] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] ${animationClasses} ${className}`}
        >
            {children}
        </div>
    )
}

export default Card