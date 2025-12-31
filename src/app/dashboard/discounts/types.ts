export interface CouponApiResponse {
    coupons: Coupon[]
    stats: {
        totalCoupons: number
        totalActiveCoupons: number
        totalUsage: number
    }
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export interface Coupon {
    _id: string
    code: string
    isActive: boolean
    discountType: 'percentage' | 'fixed'
    discountValue: number
    description: string
    tripApplicable?: {
        _id: string
        name: string
    }
    tripTitle?:string
    startDate: string
    endDate: string
    currentUsageCount?: number
    maxUsageCount?: number
    minOrderAmount?: number
    maxDiscountAmount?: number
    usageCount?: number
}

export interface CouponFormData {
    code: string
    description: string
    discountType: 'percentage' | 'fixed'
    discountValue: string
    minPurchase: string
    maxDiscount: string
    usageLimit: string
    usageLimitPerUser: string
    validFrom: string
    validUntil: string
    selectedTrip: string
}

export interface TripOption {
    _id: string
    title: string
}

export interface CouponStats {
    totalCoupons: number
    totalActiveCoupons: number
    totalUsage: number
}

export interface CouponCardProps {
    coupon: Coupon
    onDeactivateSuccess: () => void
}

export interface CouponStatsProps {
    stats: CouponStats
}
