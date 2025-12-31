'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import CouponCard from './components/CouponCard'
import CouponStats from './components/CouponStats'
import { useGetData } from '@/common/services/useGetData'
import Button from '@/common/components/atoms/Button'
import { Coupon, CouponApiResponse } from './types'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

const Discounts = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: couponsData, isLoading, error, refetch } = useGetData<CouponApiResponse>(API_ENDPOINTS.DISCOUNTS.GET_HOST_COUPONS(1,10))

  const coupons: Coupon[] = couponsData?.coupons || []

  const stats = couponsData?.stats || {
    totalCoupons: 0,
    totalActiveCoupons: 0,
    totalUsage: 0,
  }

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coupon.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && coupon.isActive) ||
                      (activeTab === 'inactive' && !coupon.isActive)
    return matchesSearch && matchesTab
  })

  const handleCreateCoupon = () => {
    router.push('/dashboard/discounts/create')
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 mb-2">Coupon Management</h1>
            <p className="text-base text-gray-500">Create and manage discount coupons for your trips</p>
          </div>
          <Button
            onClick={handleCreateCoupon}
            variant="contained"
            color="primary"
            startIcon={<Plus className="w-4 h-4" />}
            className="normal-case!"
          >
            Create Coupon
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200/60 rounded-2xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100/60 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-xs rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 text-xs rounded-xl transition-all ${
                activeTab === 'inactive'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
        <div className="mb-6">
          <CouponStats stats={stats} />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-12 text-center">
              <p className="text-gray-500">Loading coupons...</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-12 text-center">
              <p className="text-red-500">Error loading coupons</p>
            </div>
          ) : filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onDeactivateSuccess={refetch}
              />
            ))
          ) : (
            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No coupons found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discounts
