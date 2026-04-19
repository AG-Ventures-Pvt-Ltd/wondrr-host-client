
export interface BaseDocument {
  _id: string
  createdAt?: string
  updatedAt?: string
}


export type TripType = 'group_tour' | 'group_trek' | 'bike_trip'
export type TripDifficulty = 'easy' | 'moderate' | 'challenging'
export type TripStatus = 'draft' | 'in_review' | 'published' | 'archived'
export type TripBatchStatus = 'draft' | 'available' | 'filling-fast' | 'sold-out' | 'closed' | 'cancelled'
export type LocationCategory = 'meeting_point' | 'drop_point' | 'destination' | 'profile'
export type AddOnCategory = 'extra_activity' | 'room_upgrade' | 'bike_upgrade' | 'service' | 'others'
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD'


export interface GeoLocation {
  type: 'Point'
  coordinates: [number, number]
  address?: string
  city?: string
  state?: string
  country?: string
}

export interface RefundTier {
  daysBeforeCancellation: number
  refundPercentage: number
}

export interface ItineraryDayItem {
  day: number
  title: string
  description: string[]
}

export interface PricingTier {
  label: string
  description?: string
  pricePerPerson: number
  maxQuantity?: number
  bookedQuantity?: number
}

export interface AddOn {
  label: string
  description?: string
  category?: AddOnCategory
  pricePerPerson: number
  maxQuantity?: number
  bookedQuantity?: number
}

export interface MeetingPoint {
  location: string | Location
  pickupPrice?: number
}

export interface PointOfContact {
  name: string
  phone: string
}

export interface TripViews {
  instagram: number
  google: number
  direct: number
  youtube: number
  whatsapp: number
  x: number
  others: number
}

export interface TripShares {
  whatsapp: number
  instagram: number
  x: number
  others: number
}

export interface TripAccommodation {
  name?: string
  address?: string
  images?: string[]
}

// ─── Documents (extend BaseDocument) ─────────────────────────────────────────

export interface Location extends BaseDocument {
  type: 'Point'
  name: string
  geo?: GeoLocation
  category?: LocationCategory
  createdBy?: string
}

export interface CancellationPolicy extends BaseDocument {
  tripId: string
  refundTiers: RefundTier[]
}

export interface FAQDoc extends BaseDocument {
  tripId: string
  question: string
  answer: string
  priority?: number
}

export interface ItineraryDoc extends BaseDocument {
  tripId: string
  days: ItineraryDayItem[]
}

export interface TripPricing extends BaseDocument {
  trip: string
  currency?: Currency
  pricings: PricingTier[]
  addOns: AddOn[]
}

export interface TripBatch extends BaseDocument {
  tripId: string
  startDateTime: string
  endDateTime: string
  meetingPoint?: MeetingPoint[]
  dropPoint?: string[]
  pointOfContact: PointOfContact
  totalBookings?: number
  totalSeats: number
  status?: TripBatchStatus
  closeBooking: string
  isCompleted?: boolean
}

export interface Trip extends BaseDocument {
  title: string
  description?: string
  type?: TripType
  location: Location
  tripImages: string[]
  host: string
  inclusions?: string[]
  exclusions?: string[]
  highlights?: string[]
  rating?: number
  totalReviews?: number
  tags?: string[]
  category?: string[]
  difficulty?: TripDifficulty
  status: TripStatus
  isFeatured?: boolean
  isFemaleOnly?: boolean
  views?: TripViews
  shares?: TripShares
  slug?: string
  metaTitle?: string
  metaDescription?: string
  additionalInfo?: string
  accommodation?: TripAccommodation[]
  // Virtuals (may be populated)
  tripBatches?: TripBatch[]
  itinerary?: ItineraryDoc
  faqs?: FAQDoc[]
  cancellationPolicy?: CancellationPolicy
}

// ─── Composed types ───────────────────────────────────────────────────────────

/** TripBatch with meeting/drop locations fully populated instead of ID refs */
export interface TripBatchDetail extends Omit<TripBatch, 'meetingPoint' | 'dropPoint'> {
  meetingPoint: Array<{ location: Location; pickupPrice?: number }>
  dropPoint: Location[]
}

/** Lightweight trip shape for list/card views */
export type TripSummary = Pick<
  Trip,
  | '_id'
  | 'title'
  | 'slug'
  | 'type'
  | 'location'
  | 'tripImages'
  | 'rating'
  | 'totalReviews'
  | 'status'
  | 'difficulty'
  | 'category'
  | 'tags'
  | 'isFemaleOnly'
  | 'isFeatured'
  | 'createdAt'
>

/** Fully hydrated trip — all virtuals required and pricing attached */
export interface TripDetail extends Omit<Trip, 'tripBatches' | 'itinerary' | 'faqs' | 'cancellationPolicy'> {
  tripBatches: TripBatchDetail[]
  itinerary: ItineraryDoc
  faqs: FAQDoc[]
  cancellationPolicy: CancellationPolicy
  pricing: TripPricing
}

// ─── Form / UI types ──────────────────────────────────────────────────────────

export interface TripImage {
  url: string
  name: string
  isUploading?: boolean
}

export interface FAQ {
  id: number
  question: string
  answer: string
}

export interface LocationData {
  address: string
  city: string
  state: string
  latitude: number | null
  longitude: number | null
}

export interface ItineraryDay {
  id: number
  dayNumber: number
  title: string
  description: string
  wordCount: number
}

export interface Highlight {
  id: number
  title: string
  image?: string
}

export interface Inclusion {
  id: number
  text: string
}

export interface Exclusion {
  id: number
  text: string
}

export interface ThingToCarry {
  id: number
  text: string
}

export interface SharingPrice {
  id: number
  people: number
  additionalPricePerPerson: number
}

/** Form-level refund tier */
export interface FormRefundTier {
  id: number
  daysBeforeCancellation: number
  refundPercentage: number
}

/** Form-level add-on (no bookedQuantity — server-managed) */
export interface FormAddOn {
  id: number
  label: string
  description?: string
  category?: AddOnCategory
  pricePerPerson: number
  maxQuantity?: number
}

/** Form-level pricing tier (no bookedQuantity — that is server-managed) */
export interface FormPricingTier {
  id: number
  label: string
  description?: string
  pricePerPerson: number
  maxQuantity?: number
}

export interface TripFormData {
  title: string
  description: string
  type: TripType | ''
  difficulty: TripDifficulty | ''
  category: string[]
  tags: string[]
  location: LocationData
  tripImages: TripImage[]
  faqs: FAQ[]
  pricings: FormPricingTier[]
  addOns: FormAddOn[]
  cancellationPolicy: FormRefundTier[]
  itinerary: ItineraryDay[]
  highlights: Highlight[]
  inclusions: Inclusion[]
  exclusions: Exclusion[]
  thingsToCarry: ThingToCarry[]
  additionalInfo: string
  status: 'draft' | 'published'
  isFemaleOnly: boolean
  isAdvanceBookingAllowed: boolean
  advanceBookingPrice: number
}

export interface TripFormState extends TripFormData {
  currentStep: number
  validationErrors: string[]
  itineraryStartDay: 0 | 1
  setCurrentStep: (step: number) => void
  updateField: <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => void
  updateLocationField: <K extends keyof LocationData>(field: K, value: LocationData[K]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  toggleCategory: (category: string) => void
  addFAQ: (question: string, answer: string) => void
  removeFAQ: (id: number) => void
  addItineraryDay: () => void
  updateItineraryDay: (id: number, description: string) => void
  updateItineraryTitle: (id: number, title: string) => void
  removeItineraryDay: (id: number) => void
  setItineraryStartDay: (day: 0 | 1) => void
  addInclusion: (text: string) => void
  removeInclusion: (id: number) => void
  addThingToCarry: (text: string) => void
  removeThingToCarry: (id: number) => void
  addHighlight: (title: string, image?: string) => void
  removeHighlight: (id: number) => void
  addExclusion: (text: string) => void
  removeExclusion: (id: number) => void
  addPricingTier: (label: string, pricePerPerson: number, description?: string, maxQuantity?: number) => void
  removePricingTier: (id: number) => void
  updatePricingTier: (id: number, field: keyof Omit<FormPricingTier, 'id'>, value: string | number | undefined) => void
  addAddOn: (label: string, pricePerPerson: number, category?: AddOnCategory, description?: string, maxQuantity?: number) => void
  removeAddOn: (id: number) => void
  updateAddOn: (id: number, field: keyof Omit<FormAddOn, 'id'>, value: string | number | undefined) => void
  addRefundTier: (daysBeforeCancellation: number, refundPercentage: number) => void
  removeRefundTier: (id: number) => void
  updateRefundTier: (id: number, field: keyof Omit<FormRefundTier, 'id'>, value: number) => void
  setValidationErrors: (errors: string[]) => void
  clearValidationErrors: () => void
  resetForm: () => void
  prefillFormData: (data: Partial<TripFormData>) => void
  nextStep: () => void
  previousStep: () => void
}
