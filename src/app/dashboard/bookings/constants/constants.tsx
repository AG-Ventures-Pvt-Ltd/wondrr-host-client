import { TableColumn } from '@/common/components/composites/table'
import { Check, Clock, X } from 'lucide-react'
import { Booking } from '../types'

export const BOOKINGS_COLUMNS: TableColumn<Booking>[] = [
  {
    key: 'id',
    header: 'Booking ID',
    width: '10%',
    align: 'left'
  },
  {
    key: 'guestName',
    header: 'Guest Name',
    width: '15%',
    align: 'left',
    render: (_, booking) => (
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
          booking.guestInitial === 'P' ? 'bg-linear-to-br from-purple-100 to-purple-50' :
          booking.guestInitial === 'R' ? 'bg-linear-to-br from-red-100 to-red-50' :
          booking.guestInitial === 'A' ? 'bg-linear-to-br from-amber-100 to-amber-50' :
          booking.guestInitial === 'S' ? 'bg-linear-to-br from-pink-100 to-pink-50' :
          booking.guestInitial === 'K' ? 'bg-linear-to-br from-green-100 to-green-50' :
          booking.guestInitial === 'M' ? 'bg-linear-to-br from-indigo-100 to-indigo-50' :
          booking.guestInitial === 'N' ? 'bg-linear-to-br from-cyan-100 to-cyan-50' :
          booking.guestInitial === 'D' ? 'bg-linear-to-br from-orange-100 to-orange-50' :
          'bg-linear-to-br from-blue-100 to-blue-50'
        }`}>
          <span className={`text-sm font-normal ${
            booking.guestInitial === 'P' ? 'text-purple-700' :
            booking.guestInitial === 'R' ? 'text-red-700' :
            booking.guestInitial === 'A' ? 'text-amber-700' :
            booking.guestInitial === 'S' ? 'text-pink-700' :
            booking.guestInitial === 'K' ? 'text-green-700' :
            booking.guestInitial === 'M' ? 'text-indigo-700' :
            booking.guestInitial === 'N' ? 'text-cyan-700' :
            booking.guestInitial === 'D' ? 'text-orange-700' :
            'text-blue-700'
          }`}>
            {booking.guestInitial}
          </span>
        </div>
        <span className="text-sm text-maintext">{booking.guestName}</span>
      </div>
    )
  },
  {
    key: 'tripTitle',
    header: 'Trip Name',
    width: '24%',
    align: 'center'
  },
  {
    key: 'destination',
    header: 'Destination',
    width: '16%',
    align: 'left'
  },
  {
    key: 'guests',
    header: 'No. of People',
    width: '11%',
    align: 'center'
  },
  {
    key: 'status',
    header: 'Status',
    width: '10%',
    align: 'center',
    render: (value) => {
      switch (value) {
        case 'confirmed':
          return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-bg rounded-lg">
              <Check className="w-3 h-3 text-success" strokeWidth={2.5} />
              <span className="text-xs text-success">Confirmed</span>
            </div>
          )
        case 'cancelled':
          return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <X className="w-3 h-3 text-red-600" strokeWidth={2.5} />
              <span className="text-xs text-red-600">Cancelled</span>
            </div>
          )
        default: 
          return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning-bg rounded-lg">
              <Clock className="w-3 h-3 text-warning" strokeWidth={2.5} />
              <span className="text-xs text-warning">Pending</span>
            </div>
          )
      }
    }
  },
  {
    key: 'bookingDate',
    header: 'Booking Date',
    width: '14%',
    align: 'center'
  }
]