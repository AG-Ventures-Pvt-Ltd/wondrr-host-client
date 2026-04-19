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

  if (formData.category.length === 0) {
    errors.push('At least one category is required')
  }

  if (formData.tags.length < VALIDATION_RULES.MIN_TAGS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_TAGS} tags are required`)
  }

  // Location validations
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
  if (formData.pricings.length === 0) {
    errors.push('At least one pricing tier is required')
  }

  formData.pricings.forEach((tier, index) => {
    if (!tier.label.trim()) {
      errors.push(`Pricing tier ${index + 1}: Label is required`)
    }
    if (tier.pricePerPerson < 0) {
      errors.push(`Pricing tier ${index + 1}: Price per person cannot be negative`)
    }
    if (tier.maxQuantity !== undefined && tier.maxQuantity < 1) {
      errors.push(`Pricing tier ${index + 1}: Max quantity must be at least 1`)
    }
  })

  // Advance booking validations
  if (formData.isAdvanceBookingAllowed && formData.advanceBookingPrice <= 0) {
    errors.push('Advance booking price must be greater than 0 when advance booking is enabled')
  }

  // Add-on validations
  formData.addOns.forEach((addon, index) => {
    if (!addon.label.trim()) {
      errors.push(`Add-on ${index + 1}: Label is required`)
    }
    if (addon.pricePerPerson < 0) {
      errors.push(`Add-on ${index + 1}: Price per person cannot be negative`)
    }
  })

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

  // Highlights validations
  if (formData.highlights.length < VALIDATION_RULES.MIN_HIGHLIGHTS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_HIGHLIGHTS} highlights are required`)
  }

  // Exclusions validations
  if (formData.exclusions.length < VALIDATION_RULES.MIN_EXCLUSIONS) {
    errors.push(`At least ${VALIDATION_RULES.MIN_EXCLUSIONS} exclusions are required`)
  }

  // Sharing Price validations
  // (removed — sharingPrice replaced by pricings tiers)

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
      return urlObj.pathname.slice(1);
    } catch {
      return url.split('?')[0];
    }
  };

  return {
    title: formData.title,
    description: formData.description,
    type: formData.type || undefined,
    difficulty: formData.difficulty || undefined,
    category: formData.category,
    tags: formData.tags,
    location: {
      city: formData.location.city,
      state: formData.location.state,
      latitude: formData.location.latitude,
      longitude: formData.location.longitude,
    },
    isFemaleOnly: formData.isFemaleOnly,
    isAdvanceBookingAllowed: formData.isAdvanceBookingAllowed,
    advanceBookingPrice: formData.advanceBookingPrice,
    additionalInfo: formData.additionalInfo,
    status: formData.status,
    tripImages: formData.tripImages.map((img) => extractS3Path(img.url)),
    faqs: formData.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    itinerary: formData.itinerary.map((day) => ({
      day: day.dayNumber,
      title: day.title,
      description: Array.isArray(day.description) ? day.description : [day.description],
    })),
    inclusions: formData.inclusions.map((item) => item.text),
    exclusions: formData.exclusions.map((item) => item.text),
    thingsToCarry: formData.thingsToCarry.map((item) => item.text),
    highlights: formData.highlights.map((item) => ({
      title: item.title,
      image: item.image,
    })),
    pricings: formData.pricings.map((tier) => ({
      label: tier.label,
      description: tier.description,
      pricePerPerson: tier.pricePerPerson,
    })),
    addOns: formData.addOns.map((addon) => ({
      label: addon.label,
      description: addon.description,
      category: addon.category,
      pricePerPerson: addon.pricePerPerson,
    })),
    cancellationPolicy: {
      refundTiers: (formData.cancellationPolicy || []).map((tier) => ({
        daysBeforeCancellation: tier.daysBeforeCancellation,
        refundPercentage: tier.refundPercentage,
      })),
    },
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
