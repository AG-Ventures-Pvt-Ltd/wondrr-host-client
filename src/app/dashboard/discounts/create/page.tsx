'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, IndianRupee, Percent } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import usePostData from '@/common/services/usePostData'
import { useGetData } from '@/common/services/useGetData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { CouponFormData, TripOption } from '../types'

const CreateCoupon = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    usageLimitPerUser: '',
    validFrom: '',
    validUntil: '',
    selectedTrip: '',
  })

  const { data: tripsData } = useGetData<TripOption[]>(`${API_ENDPOINTS.TRIPS.GET_HOST_TRIPS}?titlesOnly=true`)
  
  const trips = tripsData || []
  const availableTrips = [
    { id: 'all', name: 'All Trips' },
    ...trips.map(trip => ({ id: trip._id, name: trip.title }))
  ]

  const { mutate: createCoupon, isPending } = usePostData({
    url: API_ENDPOINTS.DISCOUNTS.CREATE_COUPON ,
    onSuccess: () => {
      router.push('/dashboard/discounts')
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxUsageCount: formData.usageLimit ? Number(formData.usageLimit) : null,
      maxUsagePerUser: formData.usageLimitPerUser ? Number(formData.usageLimitPerUser) : null,
      startDate: formData.validFrom,
      endDate: formData.validUntil,
      minOrderAmount: formData.minPurchase ? Number(formData.minPurchase) : null,
      maxDiscountAmount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      ...(formData.selectedTrip && formData.selectedTrip !== 'all' && { tripApplicable: formData.selectedTrip })
    }

    createCoupon(payload)
  }

  const handleCancel = () => {
    router.push('/dashboard/discounts')
  }

  return (
    <div className="w-full h-full bg-white px-[10%]">
      <div className="mb-8">
        <Button
          onClick={handleCancel}
          variant="text"
          color="primary"
          startIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4! normal-case! text-sm!"
        >
          Back to Coupons
        </Button>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Create New Coupon</h1>
        <p className="text-sm text-gray-500">Fill in the details to create a new discount coupon</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="text"
            placeholder="e.g., SUMMER25"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <CustomInput
            variant="textarea"
            placeholder="Brief description of the coupon"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
              variant={formData.discountType === 'percentage' ? 'contained' : 'outlined'}
              color="primary"
              fullWidth
              startIcon={<Percent size={16} strokeWidth={2}/>}
            >
              Percentage
            </Button>
            <Button
              type="button"
              onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
              variant={formData.discountType === 'fixed' ? 'contained' : 'outlined'}
              color="primary"
              fullWidth
              startIcon={<IndianRupee size={12} strokeWidth={3}/>}
            >
              Fixed
            </Button>
          </div>
        </div>
        <div className="space-y-2 flex gap-4">
          <div className='flex-1'>
            <label className="block text-sm font-medium text-gray-700">
              Discount Value <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CustomInput
                type="number"
                placeholder="25"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {formData.discountType === 'percentage' ? '%' : '₹'}
              </span>
            </div>
          </div>
          {formData.discountType === 'percentage' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Max. Discount Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">₹</span>
                <CustomInput
                  type="number"
                  placeholder="No limit"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="pl-8!"
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Min. Purchase Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">₹</span>
              <CustomInput
                type="number"
                placeholder="0"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                className="pl-8!"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Apply To <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            value={formData.selectedTrip}
            onChange={(value) => setFormData({ ...formData, selectedTrip: value })}
            placeholder="Select trip application"
            options={availableTrips.map(trip => ({ value: trip.id, label: trip.name }))}
            required
          />
        </div>
        <div className='space-y-2 flex gap-4'>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
            <CustomInput
              type="number"
              placeholder="Unlimited"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Usage Limit Per User</label>
            <CustomInput
              type="number"
              placeholder="Unlimited"
              value={formData.usageLimitPerUser}
              onChange={(e) => setFormData({ ...formData, usageLimitPerUser: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Valid From <span className="text-red-500">*</span>
            </label>
            <CustomInput
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Valid Until <span className="text-red-500">*</span>
            </label>
            <CustomInput
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4 bottom-0 bg-white pb-6">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outlined"
            color="primary"
            fullWidth
            className="py-3! rounded-2xl! normal-case!"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-3! rounded-2xl! normal-case!"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateCoupon
