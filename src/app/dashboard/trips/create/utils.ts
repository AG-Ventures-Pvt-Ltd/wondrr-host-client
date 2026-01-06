import { TripFormData } from './types'
import { VALIDATION_RULES } from './constants'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateTripForm = (formData: TripFormData): ValidationResult => {
  const errors: string[] = []

  // Basic Information validations
  if (!formData.title.trim()) {
    errors.push('Trip title is required')
  }

  if (!formData.description.trim()) {
    errors.push('Trip description is required')
  }

  if (!formData.category.trim()) {
    errors.push('Trip category is required')
  }

  if (formData.tags.length < VALIDATION_RULES.MIN_TAGS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_TAGS} tags are required`)
  }

  // Location validations
  if (!formData.location.address.trim()) {
    errors.push('Address is required')
  }

  if (!formData.location.city.trim()) {
    errors.push('City is required')
  }

  if (!formData.location.state.trim()) {
    errors.push('State is required')
  }

  // Media validations
  if (formData.tripImages.length < VALIDATION_RULES.MIN_IMAGES) {
    errors.push(`At least ${VALIDATION_RULES.MIN_IMAGES} trip images are required`)
  }

  if (formData.faqs.length < VALIDATION_RULES.MIN_FAQS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_FAQS} FAQs are required`)
  }

  // Pricing validations
  if (formData.basePrice === null || formData.basePrice < VALIDATION_RULES.MIN_BASE_PRICE) {
    errors.push('Base price per person is required and must be a positive number')
  }

  if (formData.price === null || formData.price < VALIDATION_RULES.MIN_MAX_PRICE) {
    errors.push('Price per person is required and must be a positive number')
  }

  if (
    formData.basePrice !== null &&
    formData.price !== null &&
    formData.price < formData.basePrice
  ) {
    errors.push('Price must be greater than or equal to base price')
  }

  // Itinerary validations
  if (formData.itinerary.length < VALIDATION_RULES.MIN_ITINERARY_DAYS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_ITINERARY_DAYS} itinerary day is required`)
  }

  formData.itinerary.forEach((day) => {
    if (!day.title.trim()) {
      errors.push(`Day ${day.dayNumber} title is required`)
    }
    if (!day.description.trim()) {
      errors.push(`Day ${day.dayNumber} itinerary description is required`)
    }
    if (day.wordCount > VALIDATION_RULES.MAX_ITINERARY_WORDS) {
      errors.push(
        `Day ${day.dayNumber} itinerary exceeds ${VALIDATION_RULES.MAX_ITINERARY_WORDS} words limit`
      )
    }
  })

  // Inclusions validations
  if (formData.inclusions.length < VALIDATION_RULES.MIN_INCLUSIONS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_INCLUSIONS} inclusions are required`)
  }

  // Exclusions validations
  if (formData.exclusions.length < VALIDATION_RULES.MIN_EXCLUSIONS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_EXCLUSIONS} exclusions are required`)
  }

  // Sharing Price validations
  formData.sharingPrice.forEach((sp, index) => {
    if (sp.people < 1) {
      errors.push(`Sharing option ${index + 1}: Number of people must be at least 1`)
    }
    if (sp.additionalPricePerPerson < 0) {
      errors.push(`Sharing option ${index + 1}: Additional price cannot be negative`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const prepareSubmissionData = (formData: TripFormData) => {
  const extractS3Path = (url: string): string => {
    try {
      const urlWithoutQuery = url.split('?')[0];
      const urlObj = new URL(urlWithoutQuery);
      return urlObj.pathname.slice(1); // Remove leading slash to get path after domain
    } catch {
      // Fallback: if URL parsing fails, return the original without query
      return url.split('?')[0];
    }
  };

  return {
    ...formData,
    tripImages: formData.tripImages.map((img) => extractS3Path(img.url)),
    itinerary: formData.itinerary.map((day) => ({
      day: day.dayNumber,
      title: day.title,
      description: day.description,
      activities: day.activities,
    })),
    inclusions: formData.inclusions.map((item) => item.text),
    exclusions: formData.exclusions.map((item) => item.text),
    sharingPrice: formData.sharingPrice.map((sp) => ({
      people: sp.people,
      additionalPricePerPerson: sp.additionalPricePerPerson,
    })),
    additionalInfo: formData.additionalInfo,
    status: 'draft',
  }
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const isValidImageFile = (file: File): boolean => {
  return (
    VALIDATION_RULES.ACCEPTED_IMAGE_TYPES.includes(file.type as never) &&
    file.size <= VALIDATION_RULES.MAX_IMAGE_SIZE
  )
}
