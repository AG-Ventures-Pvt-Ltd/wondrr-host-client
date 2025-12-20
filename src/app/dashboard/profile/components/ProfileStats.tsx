import React from 'react';
import Card from '@/common/components/composites/Card';

interface ProfileStatProps {
  label: string;
  value: string;
  subtext: string;
  subtextColor?: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<ProfileStatProps> = ({
  label,
  value,
  subtext,
  subtextColor = 'text-neutral-500',
  icon,
  iconBgColor,
  iconColor
}) => {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="text-sm text-neutral-500">{label}</span>
        <div className={`${iconBgColor} ${iconColor} rounded-[10px] p-1.5 text-base flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-normal text-neutral-900 tracking-tight">
        {value}
      </div>
      <div className={`text-xs ${subtextColor}`}>
        {subtext}
      </div>
    </Card>
  );
};

interface ProfileStatsProps {
  stats: ProfileStatProps[];
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
