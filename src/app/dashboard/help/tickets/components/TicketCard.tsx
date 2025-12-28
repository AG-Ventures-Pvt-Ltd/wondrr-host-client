import React from 'react';
import { FileText } from 'lucide-react';
import { Ticket, normalizeStatus } from '../constants';
import StatusBadge from './StatusBadge';
import Card from '@/common/components/composites/Card';
import { formatDateTime } from '@/common/utils/dateUtils';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const normalizedStatus = normalizeStatus(ticket.status);
  const isResolved = normalizedStatus === 'Resolved';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3 flex-1">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl">
              <FileText className="text-indigo-600" size={24} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="text-base text-neutral-900">{ticket.description}</h3>
              <p className="text-xs text-neutral-500">ID: {ticket._id}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-start gap-[12%] pl-16">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500">Category</span>
              <span className="text-sm text-neutral-900">{ticket.type}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500">Created On</span>
              <span className="text-sm text-neutral-900">{formatDateTime(ticket.createdAt)}</span>
            </div>
            {isResolved ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500">Resolved On</span>
                <span className="text-sm text-neutral-900">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500">Status</span>
                <span className="text-sm text-neutral-900">{normalizedStatus}</span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={normalizedStatus} />
      </div>
    </Card>
  );
};

export default TicketCard;
