import React from 'react';
import { Batch } from '../types';

interface BatchCardProps {
  batch: Batch;
  onClick?: () => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="h-[38px] rounded-lg p-2 cursor-pointer hover:opacity-90 transition-opacity"
      style={{ backgroundColor: batch.color }}
    >
      <div className="overflow-hidden">
        <p className="text-white text-[11px] leading-[16.5px] tracking-[0.06px] truncate">
          {batch.title}
        </p>
      </div>
      <div className="mt-0.5 opacity-90">
        <p className="text-white text-[9px] leading-[13.5px] tracking-[0.17px]">
          {batch.time}
        </p>
      </div>
    </div>
  );
};

export default BatchCard;
