'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from '@/common/components/atoms/Button';
import BackButton from '@/common/ui/BackButton';

interface TicketHeaderProps {
  onRaiseTicket: () => void;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ onRaiseTicket }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Back to Help */}
      <BackButton label="Back to Help" to="/dashboard/help" iconSize={16} className="text-neutral-600 hover:text-neutral-900" />

      {/* Header Card */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-md">
              <HelpCircle className="text-white" size={32} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-base text-neutral-900 font-medium">
                Need Help with Something?
              </h1>
              <p className="text-sm text-neutral-600">
                Our support team is here to help you resolve any issues quickly
              </p>
            </div>
          </div>
          <Button
            onClick={onRaiseTicket}
            startIcon={<HelpCircle size={20} />}
            className="px-8 h-12 bg-green-600! text-white rounded-2xl! shadow-md! hover:bg-green-700! transition-colors!"
          >
            <span className="text-base">Raise New Ticket</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
