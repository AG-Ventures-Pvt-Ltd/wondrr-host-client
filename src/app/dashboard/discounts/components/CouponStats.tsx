import { Target, CheckCircle2, TrendingUp } from 'lucide-react'
import Card from '@/common/components/composites/Card'
import { CouponStatsProps } from '../types'

const CouponStats = ({ stats }: CouponStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1 bg-primary-bg rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-gray-500">Total</span>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-normal text-gray-900 mb-1">{stats.totalCoupons}</h3>
          <p className="text-xs text-gray-500">Total Coupons</p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-xs text-gray-500">Status</span>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-normal text-green-900 mb-1">{stats.totalActiveCoupons}</h3>
          <p className="text-xs text-gray-500">Active Coupons</p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1 bg-orange-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <span className="text-xs text-gray-500">Usage</span>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-normal text-orange-900 mb-1">{stats.totalUsage}</h3>
          <p className="text-xs text-gray-500">Total Uses</p>
        </div>
      </Card>
    </div>
  )
}

export default CouponStats
