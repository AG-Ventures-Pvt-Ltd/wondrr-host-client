import React from 'react';
import Card from '@/common/components/composites/Card';
import { Calendar } from 'lucide-react';

interface MembershipData {
  memberSince: string;
  planType: string;
  status: string;
}

interface MembershipInfoProps {
  data: MembershipData;
}

export const MembershipInfo: React.FC<MembershipInfoProps> = ({ data }) => {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-base text-neutral-900">Membership</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Member Since</span>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neutral-400" />
            <span className="text-sm text-neutral-900">{data.memberSince}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Plan Type</span>
          <div className="px-3 py-1.5 bg-blue-50 rounded-[10px]">
            <span className="text-sm text-blue-700">{data.planType}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-700">{data.status}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
