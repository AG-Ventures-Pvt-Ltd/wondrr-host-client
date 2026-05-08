import { TripFormData } from './types'
import { VALIDATION_RULES, VALIDATION_MESSAGES } from './constants'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateTripForm = (formData: TripFormData): ValidationResult => {
  const errors: string[] = []

  // Basic Information validations
  if (!formData.title.trim()) {
    errors.push(VALIDATION_MESSAGES.title)
  }

  if (!formData.description.trim()) {
    errors.push(VALIDATION_MESSAGES.description)
  }

  if (formData.category.length === 0) {
    errors.push(VALIDATION_MESSAGES.category)
  }

  if (formData.tags.length < VALIDATION_RULES.MIN_TAGS) {
    errors.push(VALIDATION_MESSAGES.tags)
  }

  // Location validations
  if (!formData.location.city.trim()) {
    errors.push(VALIDATION_MESSAGES.locationCity)
  }

  if (!formData.location.state.trim()) {
    errors.push(VALIDATION_MESSAGES.locationState)
  }

  // Media validations
  if (formData.tripImages.length < VALIDATION_RULES.MIN_IMAGES) {
    errors.push(VALIDATION_MESSAGES.tripImages)
  }

  if (formData.faqs.length < VALIDATION_RULES.MIN_FAQS) {
    errors.push(VALIDATION_MESSAGES.faqs)
  }

  // Pricing validations
  if (formData.pricings.length === 0) {
    errors.push(VALIDATION_MESSAGES.pricings)
  }

  formData.pricings.forEach((tier, index) => {
    if (!tier.label.trim()) {
      errors.push(VALIDATION_MESSAGES.pricingTierLabel(index))
    }
    if (tier.pricePerPerson < 0) {
      errors.push(VALIDATION_MESSAGES.pricingTierPrice(index))
    }
    if (tier.maxQuantity !== undefined && tier.maxQuantity < 1) {
      errors.push(VALIDATION_MESSAGES.pricingTierQuantity(index))
    }
  })

  // Advance booking validations
  if (formData.isAdvanceBookingAllowed && formData.advanceBookingPrice <= 0) {
    errors.push(VALIDATION_MESSAGES.advanceBookingPrice)
  }

  // Add-on validations
  formData.addOns.forEach((addon, index) => {
    if (!addon.label.trim()) {
      errors.push(VALIDATION_MESSAGES.addonLabel(index))
    }
    if (addon.pricePerPerson < 0) {
      errors.push(VALIDATION_MESSAGES.addonPrice(index))
    }
  })

  // Itinerary validations
  if (formData.itinerary.length < VALIDATION_RULES.MIN_ITINERARY_DAYS) {
    errors.push(VALIDATION_MESSAGES.itinerary)
  }

  formData.itinerary.forEach((day) => {
    if (!day.title.trim()) {
      errors.push(VALIDATION_MESSAGES.itineraryDayTitle(day.dayNumber))
    }
    if (!day.description.trim()) {
      errors.push(VALIDATION_MESSAGES.itineraryDayDescription(day.dayNumber))
    }
    if (day.wordCount > VALIDATION_RULES.MAX_ITINERARY_WORDS) {
      errors.push(VALIDATION_MESSAGES.itineraryDayWordCount(day.dayNumber))
    }
  })

  // Inclusions validations
  if (formData.inclusions.length < VALIDATION_RULES.MIN_INCLUSIONS) {
    errors.push(VALIDATION_MESSAGES.inclusions)
  }

  // Highlights validations
  if (formData.highlights.length < VALIDATION_RULES.MIN_HIGHLIGHTS) {
    errors.push(VALIDATION_MESSAGES.highlights)
  }

  // Exclusions validations
  if (formData.exclusions.length < VALIDATION_RULES.MIN_EXCLUSIONS) {
    errors.push(VALIDATION_MESSAGES.exclusions)
  }

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
    closeAdvanceBookingDays: formData.closeAdvanceBookingDays || undefined,
    bestTimeToVisit: formData.bestTimeToVisit || undefined,
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
