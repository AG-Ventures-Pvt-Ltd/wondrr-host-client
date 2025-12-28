// Trip-related types
export interface TripListApiResponse {
  _id: string
  title: string
  batches: number
  slug: string
}

export interface TripList {
  id: string
  name: string
  batches: string
  slug: string
}

export interface TripBatchDetails {
  id: string
  date: string
  status: string
  duration: string
  priceRange: string
  seats: string
  revenue: string
  occupancy: string
}

export interface TripDetailsApiResponse {
  _id: string
  title: string
  location: {
    address: string
    city: string
    state: string
  }
  description: string
  images: string[]
  tags: string[]
  category: string
  faqs: [{ question: string; answer: string }]
  itinerary: Array<{
    day: string
    title?: string
    description: string
    activities?: string[]
  }>
  inclusions: string[]
  exclusions: string[]
  basePrice?: number
  price?: number
  stats: {
    tripBatchesCount: number
    totalRevenue: number
    category: string
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
  image: string
  images: string[]
  tags: string[]
  category: string
  faqs: [{ question: string; answer: string }]
  itinerary: Array<{
    day: string
    title?: string
    description: string
    activities?: string[]
  }>
  inclusions: string[]
  exclusions: string[]
  basePrice?: number
  price?: number
  stats: {
    tripBatchesCount: number
    totalRevenue: number
    category: string
  }
}
