export const TRIP_CATEGORIES = [
  'Adventure',
  'Cultural',
  'Relaxation',
  'Wildlife',
  'Beach',
  'Mountain',
  'Road Trip',
  'Spiritual',
  'Trek',
  'Desert',
  'Historical',
  'Camping',
  'Other',
] as const

export const FORM_STEPS = [
  { id: 1, title: 'Basic Information', description: 'Trip details and location' },
  { id: 2, title: 'Pricing & Itinerary', description: 'Pricing and day-wise plan' },
  { id: 3, title: 'Inclusions & Exclusions', description: "What's included and excluded" },
  { id: 4, title: 'Media & FAQ', description: 'Images and questions' },
] as const

export const VALIDATION_RULES = {
  MIN_TAGS: 7,
  MIN_IMAGES: 5,
  MIN_FAQS: 4,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg'],
  MIN_ITINERARY_DAYS: 1,
  MIN_INCLUSIONS: 3,
  MIN_EXCLUSIONS: 2,
  MAX_ITINERARY_WORDS: 100,
  MIN_BASE_PRICE: 0,
  MIN_MAX_PRICE: 0,
} as const

export const IMAGE_UPLOAD_CONFIG = {
  maxSize: VALIDATION_RULES.MAX_IMAGE_SIZE,
  acceptedTypes: VALIDATION_RULES.ACCEPTED_IMAGE_TYPES,
  minRequired: VALIDATION_RULES.MIN_IMAGES,
} as const

export const PHOTO_TIPS = [
  'Use high-resolution images (at least 1920x1080px)',
  'Show diverse aspects: landscapes, activities, accommodations',
  'Include photos of previous trips if available',
  'Avoid heavily edited or filtered images',
  'Ensure you have rights to use the images',
] as const
