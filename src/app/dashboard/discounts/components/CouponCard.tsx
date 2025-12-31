import Card from '@/common/components/composites/Card'
import Button from '@/common/components/atoms/Button'
import { CouponCardProps } from '../types'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import usePostData from '@/common/services/usePostData'

const CouponCard = ({ coupon, onDeactivateSuccess }: CouponCardProps) => {
  const getStatusColor = (status: boolean) => {
    return status 
      ? 'bg-success-bg text-success' 
      : 'bg-subtext-bg text-subtext'
  }

  const getDiscountBadgeColor = () => {
    return ' bg-warning-bg text-warning'
  }

  const calculateProgress = () => {
    if (!coupon.maxUsageCount) return 0
    return (coupon.currentUsageCount || 0) / coupon.maxUsageCount * 100
  }

  const formatValidity = () => {
    if (!coupon.startDate || !coupon.endDate) return 'N/A'
    
    const startDate = new Date(coupon.startDate)
    const endDate = new Date(coupon.endDate)
    
    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${date.getDate()}`
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const getAppliesTo = () => {
    if (!coupon.tripApplicable) {
      return 'All Trips'
    }
    return coupon.tripTitle || 'Specific Trip'
  }

    const { mutate: deactivateCoupon } = usePostData({
    url:  API_ENDPOINTS.DISCOUNTS.DEACTIVATE_COUPON(coupon._id),
    onSuccess: () => {
      onDeactivateSuccess()
    }
  })

  const onDeactivate = () => {
    deactivateCoupon({})
  }

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-bg px-4 py-2 rounded-lg">
              <h3 className="text-lg font-normal text-primary">{coupon.code}</h3>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs ${getStatusColor(coupon.isActive)}`}>
              {coupon.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs ${getDiscountBadgeColor()}`}>
              {coupon.discountType === 'percentage' 
                ? `${coupon.discountValue}% Off` 
                : `₹${coupon.discountValue} Off`}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-6">{coupon.description}</p>

          <div className="grid grid-cols-3 gap-8 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Applies To</p>
              <p className="text-sm text-gray-900">{getAppliesTo()}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Validity</p>
              <p className="text-sm text-gray-900">{formatValidity()}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Usage</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">
                  {coupon.currentUsageCount || 0} / {coupon.maxUsageCount || '∞'}
                </span>
                {coupon.maxUsageCount && (
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {coupon.minOrderAmount && (
              <span>Min. Purchase: ₹{coupon.minOrderAmount}</span>
            )}
            {coupon.maxDiscountAmount && (
              <span>Max. Discount: ₹{coupon.maxDiscountAmount}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <Button
            onClick={onDeactivate}
            variant={coupon.isActive ? "outlined" : "contained"}
            color="primary"
            className="normal-case!"
          >
            {coupon.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CouponCard
