import React from 'react'
import { Clock } from 'lucide-react'
import Card from '@/common/components/composites/Card'
import { Batch } from '../types'

interface DayBatchesSidebarProps {
  selectedDate: Date | null
  batches: Batch[]
}

const DayBatchesSidebar: React.FC<DayBatchesSidebarProps> = ({ selectedDate, batches }) => {
  if (!selectedDate) {
    return (
      <Card className="p-6">
        <p className="text-sm text-gray-500">Select a date to view batches</p>
      </Card>
    )
  }

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Card className="p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-base text-maintext">{monthDay}</h3>
          <p className="text-xs text-subtext">{dayName}</p>
        </div>
        <div className="w-7 h-7 flex items-center justify-center">
          <svg className="w-4 h-4 text-subtext" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="5.33" stroke="currentColor" strokeWidth="1.33"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
        {batches.length === 0 ? (
          <p className="text-sm text-gray-500">No batches scheduled</p>
        ) : (
          batches.map((batch) => (
            <Card key={batch.id} className="p-4 border border-gray-200/60">
              <div className="flex gap-2">
                <div 
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0" 
                  style={{ backgroundColor: batch.color }}
                />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm text-maintext">{batch.title}</h4>
                    <p className="text-xs text-subtext">{batch.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Clock className="w-3 h-3" />
                    <span>{batch.time}</span>
                    <span>•</span>
                    <span>{batch.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full opacity-80"
                        style={{ 
                          backgroundColor: batch.color,
                          width: `${(batch.seatsBooked / batch.totalSeats) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-subtext leading-none">
                      {batch.seatsBooked}/{batch.totalSeats}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  )
}

export default DayBatchesSidebar
