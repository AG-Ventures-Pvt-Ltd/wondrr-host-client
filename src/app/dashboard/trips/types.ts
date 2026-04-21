// Trip-related types
export interface TripListApiResponse {
  _id: string
  title: string
  batches: number
  slug: string
  image?: string
  location?: string
  upcomingBatches?: number
  completedBatches?: number
  status?: string
}

export interface TripList {
  id: string
  name: string
  batches: string
  slug: string
  image?: string
  location?: string
  upcomingBatches: number
  completedBatches: number
  status?: string
}

export interface TripBatchDetails {
  _id: string
  startDate: string
  endDate: string
  status: string
  totalSeats: number
  totalBookings: number
  revenue: string
  priceRange: string
  durationDays: number
  occupancyPercent: number
  rating?: number
  reviewCount?: number
}

export interface TripBatchesResponse {
  batches: TripBatchDetails[]
  total: number
  page: number
  limit: number
  tripTitle?: string
  tripLocation?: string
  hasNextPage?: boolean
  hasPrevPage?: boolean
  totalPages?: number
}

export interface TripDetailsApiResponse {
  _id: string
  title: string
  status?: string
  location: {
    address: string
    city: string
    state: string
  }
  description: string
  tripImages: string[]
  tags: string[]
  category: string[]
  highlights: Array<{
    title: string
    image?: string
  }>
  isFemaleOnly: boolean
  difficulty?: string
  rating?: number
  totalReviews?: number
  faqs: [{ question: string; answer: string }]
  itinerary: Array<{
    day: string
    title?: string
    description: string
    activities?: string[]
  }>
  inclusions: string[]
  exclusions: string[]
  thingsToCarry?: string[]
  pricing?: {
    currency: string
    pricings: Array<{
      label: string
      description: string
      pricePerPerson: number
    }>
    addOns: Array<{
      label: string
      description: string
      category: string
      pricePerPerson: number
    }>
    isAdvanceBookingAllowed?: boolean
    advanceBookingPrice?: number
  }
  additionalInfo?: string
  cancellationPolicy?: {
    refundTiers: Array<{
      daysBeforeCancellation: number
      refundPercentage: number
    }>
  }
  totalViews?: number
  totalShares?: number
  stats: {
    tripBatchesCount: number
    totalRevenue: number
  }
}

export interface TripDetails {
  id: string
  title: string
  location: string
  locationObj: {
    address: string
    city: string
    state: string
  }
  description: string
  status?: string
  tripImages: string[]
  tags: string[]
  category: string[]
  highlights: Array<{
    title: string
    image?: string
  }>
  isFemaleOnly: boolean
  difficulty?: string
  rating?: number
  totalReviews?: number
  faqs: [{ question: string; answer: string }]
  itinerary: Array<{
    day: string
    title?: string
    description: string
    activities?: string[]
  }>
  inclusions: string[]
  exclusions: string[]
  thingsToCarry?: string[]
  pricing?: {
    currency: string
    pricings: Array<{
      label: string
      description: string
      pricePerPerson: number
    }>
    addOns: Array<{
      label: string
      description: string
      category: string
      pricePerPerson: number
    }>
    isAdvanceBookingAllowed?: boolean
    advanceBookingPrice?: number
  }
  additionalInfo?: string
  cancellationPolicy?: {
    refundTiers: Array<{
      daysBeforeCancellation: number
      refundPercentage: number
    }>
  }
  totalViews?: number
  totalShares?: number
  stats: {
    batches: number
    totalRevenue: string
  }
  isAdvanceBookingAllowed?: boolean
  advanceBookingPrice?: number
}
