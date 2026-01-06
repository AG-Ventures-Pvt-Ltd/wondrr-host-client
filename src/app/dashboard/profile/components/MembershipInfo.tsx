import React from 'react';
import Card from '@/common/components/composites/Card';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/common/utils/dateUtils';

interface MembershipData {
  memberSince: string;
  // planType: string;
  status: boolean;
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
            <span className="text-sm text-neutral-900">{formatDate(data.memberSince)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${data.status === true ? 'bg-green-500' : "bg-warning"} rounded-full`} />
            <span className={`text-sm ${data.status === true ? 'text-green-500' : "text-warning"}`}>{data.status ? 'Verified' : 'Not Verified'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
