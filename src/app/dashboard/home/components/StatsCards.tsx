import React from 'react';
import Card from '@/common/components/composites/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  title: string;
  stat: string;
  direction: 'up' | 'down';
}

interface StatsCardsProps {
  statsData: StatItem[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ statsData }) => {
  return (
    <div className='flex justify-between gap-5 mt-8'>
      {statsData.map((item) => (
        <Card key={item.title} className="p-6 flex-1">
          <div className='flex justify-between '>
            <div className='flex flex-col gap-3'>
              <div>
                <h2 className='text-sm text-subtext'>{item.title}</h2>
                <p className='mt-2 text-3xl'>{item.stat}</p>
              </div>
            </div>
            <div>
              {item.direction === "up" ? (
                <TrendingUp className='text-success bg-success-bg p-1 rounded-lg' size={28} />
              ) : (
                <TrendingDown className='text-warning bg-warning-bg p-1 rounded-lg' size={28} />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
