import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  iconSize?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  label = 'Back', 
  to, 
  onClick,
  className = '',
  iconSize = 20
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 text-maintext rounded-lg cursor-pointer w-fit hover:opacity-70 transition-opacity ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft size={iconSize} />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default BackButton;
