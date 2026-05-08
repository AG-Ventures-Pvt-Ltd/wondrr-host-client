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
  faqs: FAQs[]
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
      pricePerPerson: string
    }>
    addOns: Array<{
      label: string
      description: string
      category: string
      pricePerPerson: string
    }>
    isAdvanceBookingAllowed?: boolean
    advanceBookingPrice?: number
  }
  additionalInfo?: string
  bestTimeToVisit?: string
  cancellationPolicy?: CancellationPolicy
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
  faqs: FAQs[]
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
      description?: string
      pricePerPerson: number
    }>
    addOns: Array<{
      label: string
      description?: string
      category?: string
      pricePerPerson: number
    }>
    isAdvanceBookingAllowed?: boolean
    advanceBookingPrice?: number
  }
  additionalInfo?: string
  cancellationPolicy?: CancellationPolicy
  totalViews?: number
  totalShares?: number
  stats: {
    batches: number
    totalRevenue: string
  }
  isAdvanceBookingAllowed?: boolean
  advanceBookingPrice?: number
  closeAdvanceBookingDays?: number
  bestTimeToVisit?: string
}



export interface Itinerary {
  day: string
  title?: string
  description: string
}

export interface RefundTier { 
  daysBeforeCancellation : number
  refundPercentage : number
}

export interface CancellationPolicy {
  refundTiers: RefundTier[]
}

export interface FAQs { 
  question: string; 
  answer: string;
  priority?: number;
}

export interface PricingTier {
  label : string;
  description : string;
  pricePerPerson : string;
  bookedQuantity?: string;
}

export interface addOns {
  label : string;
  description : string;
  pricePerPerson : string;
  category : 'extra_activity' | 'room_upgrade' | 'bike_upgrade' | 'service' | 'others';
  bookedQuantity?: string;
}

export interface AdvanceBookings {
  isAdvanceBookingAllowed : boolean;
  advanceBookingPrice : number;
  closeAdvanceBookingDays : number;
}


export interface TripBatches {
  _id: string
  startDateTime : string;
  endDateTime : string;
  meetingPoint : {
    location : string;
    pickupPrice : number;
  }
  dropPoint : string;
  pointOfContact : {
    name : string;
    phone : string;
  }
  totalBookings : number;
  totalSeats : number;
  status : 'draft' | 'available' | 'filling-fast' | 'sold-out' | 'closed' | 'cancelled';
  closeBooking : string;
  isCompleted : boolean;
}

export interface Trips {
  title : string ;
  description : string;
  location : {
    address: string
    city: string
    state: string
  };
  tripImages : Array<string>;
  host : string;
  inclusions : Array<string>;
  exclusions : Array<string>;
  highlights : [{ title : string; image?: string; }]
  thingsToCarry : Array<string>;
  rating : number;
  totalReviews : number;
  category : Array<string>;
  difficulty : string;
  bestTimeToVisit : string;
  status : 'draft' | 'in_review' | 'published' | 'archived';
  isFemaleOnly : boolean;
  slug : string;
  additionalInfo : string;
}

export interface reviews {
  userId : string;
  rating : number ;
  comment : string;
  helpful : number;
}