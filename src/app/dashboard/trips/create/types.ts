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
  activities: string[]
  wordCount: number
}

export interface Inclusion {
  id: number
  text: string
}

export interface Exclusion {
  id: number
  text: string
}

export interface SharingPrice {
  id: number
  people: number
  additionalPricePerPerson: number
}

export interface TripFormData {
  title: string
  description: string
  category: string
  tags: string[]
  location: LocationData
  tripImages: TripImage[]
  faqs: FAQ[]
  basePrice: number | null
  price: number | null
  sharingPrice: SharingPrice[]
  itinerary: ItineraryDay[]
  inclusions: Inclusion[]
  exclusions: Exclusion[]
  additionalInfo: string
  status: 'draft' | 'published'
  isFemaleOnly: boolean
}

export interface TripFormState extends TripFormData {
  currentStep: number
  validationErrors: string[]
  setCurrentStep: (step: number) => void
  updateField: <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => void
  updateLocationField: <K extends keyof LocationData>(field: K, value: LocationData[K]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  addFAQ: (question: string, answer: string) => void
  removeFAQ: (id: number) => void
  addItineraryDay: () => void
  updateItineraryDay: (id: number, description: string) => void
  updateItineraryTitle: (id: number, title: string) => void
  addItineraryActivity: (id: number, activity: string) => void
  removeItineraryActivity: (id: number, activityIndex: number) => void
  removeItineraryDay: (id: number) => void
  addInclusion: (text: string) => void
  removeInclusion: (id: number) => void
  addExclusion: (text: string) => void
  removeExclusion: (id: number) => void
  addSharingPrice: (people: number, additionalPricePerPerson: number) => void
  removeSharingPrice: (id: number) => void
  updateSharingPrice: (id: number, field: 'people' | 'additionalPricePerPerson', value: number) => void
  setValidationErrors: (errors: string[]) => void
  clearValidationErrors: () => void
  resetForm: () => void
  prefillFormData: (data: Partial<TripFormData>) => void
  nextStep: () => void
  previousStep: () => void
}
