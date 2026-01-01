import { Tickets, TicketCheck, Ticket } from 'lucide-react'
import Card from '@/common/components/composites/Card'
import { CouponStatsProps } from '../types'

const CouponStats = ({ stats }: CouponStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className='flex gap-6 items-start'>
        <div className="flex items-center justify-between mb-2 mt-1">
          <div className="p-1 rounded-lg">
            <Tickets className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-normal text-gray-900 mb-1">{stats.totalCoupons}</h3>
          <p className="text-xs text-gray-500">Total Coupons</p>
        </div>
      </Card>

      <Card className='flex gap-6 items-start'>
        <div className="flex items-center mb-2 mt-1">
          <div className="p-1 rounded-lg">
            <Ticket className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-normal text-green-900 mb-1">{stats.totalActiveCoupons}</h3>
          <p className="text-xs text-gray-500">Active Coupons</p>
        </div>
      </Card>

      <Card className='flex gap-6 items-start'>
        <div className="flex items-center justify-between mb-2 mt-1">
          <div className="p-1 rounded-lg">
            <TicketCheck className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-normal text-orange-900 mb-1">{stats.totalUsage}</h3>
          <p className="text-xs text-gray-500">Total Uses</p>
        </div>
      </Card>
    </div>
  )
}

export default CouponStats
