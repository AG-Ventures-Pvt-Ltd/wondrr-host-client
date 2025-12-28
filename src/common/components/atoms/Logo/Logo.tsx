import React from 'react'
import { useRouter } from 'next/navigation'

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', isCollapsed }) => {
  const router = useRouter()

  if (!isCollapsed) {
    return (
      <h1 className={`text-3xl font-extrabold cursor-pointer p-6 translate-x-[10%] ${className}`} onClick={() => router.push('/dashboard')}>Wondrr</h1>
    )
  }

  return (
    <h1 className={`text-3xl font-extrabold cursor-pointer py-6 translate-x-[50%] text-center ${className}`} onClick={() => router.push('/dashboard')}>W</h1>
  )
}


export default Logo