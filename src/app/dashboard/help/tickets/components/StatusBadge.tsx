import React from 'react';

interface StatusBadgeProps {
  status: 'Resolved' | 'In Progress' | 'Open';
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-50 text-green-700';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700';
      case 'Open':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-2.5 h-6 text-xs';

  return (
    <div className={`${getStatusStyles()} ${sizeClasses} rounded-lg flex items-center justify-center w-fit`}>
      {status}
    </div>
  );
};

export default StatusBadge;
