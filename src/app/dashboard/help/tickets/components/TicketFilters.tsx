'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from '../constants';

interface TicketFiltersProps {
  selectedStatus: string;
  selectedCategory: string;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  totalTickets: number;
  resolvedTickets: number;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
  totalTickets,
  resolvedTickets,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 shadow-sm">
      <div className="flex items-center gap-5">
        {/* Filter Label */}
        <div className="flex items-center gap-2">
          <Filter className="text-neutral-400" size={20} />
          <span className="text-sm text-neutral-700">Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-neutral-500">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 px-3 rounded-2xl border border-neutral-200 text-sm text-neutral-950 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-neutral-500">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 px-3 rounded-2xl border border-neutral-200 text-sm text-neutral-950 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        {/* Summary Stats */}
        <div className="flex items-center gap-6 px-6 h-16 bg-indigo-50 rounded-2xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-indigo-600">Total Tickets</span>
            <span className="text-lg text-indigo-900">{totalTickets}</span>
          </div>
          <div className="w-px h-10 bg-indigo-200" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-indigo-600">Resolved</span>
            <span className="text-lg text-indigo-900">
              {resolvedTickets}/{totalTickets}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
