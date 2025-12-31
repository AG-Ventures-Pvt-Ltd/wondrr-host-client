import React from 'react';
import { FilterType } from '../types';
import { FILTER_OPTIONS } from '../constants';

interface ScheduleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  // searchQuery,
  // onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="w-full flex justify-end gap-4">
      {/* Search Bar */}
      {/* <div className="relative flex-1 max-w-[718px]">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7.33" cy="7.33" r="5.33" stroke="#A1A1A1" strokeWidth="1.33"/>
            <path d="M13.11 13.11L11.33 11.33" stroke="#A1A1A1" strokeWidth="1.33" strokeLinecap="round"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-[42px] pl-10 pr-4 rounded-[14px] border border-[rgba(229,229,229,0.6)] text-[14px] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-primary"
        />
      </div> */}

      {/* Filter Tabs */}
      <div className="flex items-center justify-end gap-2 bg-[rgba(245,245,245,0.6)] rounded-[14px] p-1">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-4 h-8 rounded-[10px] text-[12px] leading-4 transition-all ${
              activeFilter === option.value
                ? 'bg-white text-maintext shadow-sm'
                : 'text-subtext hover:text-maintext'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleFilters;
