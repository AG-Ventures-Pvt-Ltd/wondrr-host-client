import React from 'react';

interface CalendarNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  onPrevious,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="w-[34px] h-[34px] rounded-[10px] border border-[rgba(229,229,229,0.6)] flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Previous month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="#525252"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Today Button */}
      <button
        onClick={onToday}
        className="h-[38px] px-4 rounded-[10px] border border-[rgba(229,229,229,0.6)] text-[14px] text-[#404040] leading-5 hover:bg-gray-50 transition-colors"
      >
        Today
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-[34px] h-[34px] rounded-[10px] border border-[rgba(229,229,229,0.6)] flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Next month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="#525252"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CalendarNavigation;
