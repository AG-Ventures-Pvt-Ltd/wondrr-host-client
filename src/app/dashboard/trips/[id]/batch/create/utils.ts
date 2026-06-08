import { BatchFormData } from './types'
import { ValidationResult } from '@/types/common'

export const validateBatchForm = (formData: BatchFormData): ValidationResult => {
  const errors: string[] = []

  // Batch Details validations
  if (!formData.startDateTime.trim()) {
    errors.push('Start date and time is required')
  }

  if (!formData.endDateTime.trim()) {
    errors.push('End date and time is required')
  }

  // Meeting Points validation
  if (!formData.meetingPoint || formData.meetingPoint.length === 0) {
    errors.push('At least one meeting point is required')
  } else {
    formData.meetingPoint.forEach((point, index) => {
      if (!point.location.trim()) {
        errors.push(`Meeting point ${index + 1}: Location ID is required`)
      }
      if (point.pickupPrice === null || point.pickupPrice < 0) {
        errors.push(`Meeting point ${index + 1}: Pickup price is required and must be non-negative`)
      }
    })
  }

  if (!formData.pointOfContact.name.trim()) {
    errors.push('Point of contact name is required')
  }

  if (!formData.pointOfContact.phone.trim()) {
    errors.push('Point of contact phone number is required')
  } else if (!/^\d{10}$/.test(formData.pointOfContact.phone)) {
    errors.push('Phone number must be 10 digits')
  }

  if (formData.totalSeats === null || formData.totalSeats <= 0) {
    errors.push('Total seats is required and must be greater than 0')
  }

  if (!formData.closeBooking.trim()) {
    errors.push('Close booking date and time is required')
  }

  // DateTime validations
  if (formData.startDateTime && formData.endDateTime) {
    const startDate = new Date(formData.startDateTime)
    const endDate = new Date(formData.endDateTime)
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date and time')
    }
  }

  // Close booking validations
  if (formData.closeBooking && formData.startDateTime) {
    const closeBookingDate = new Date(formData.closeBooking + 'T00:00')
    const startDateStr = formData.startDateTime.split('T')[0] // IST date from datetime-local
    const startDate = new Date(startDateStr + 'T00:00')
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    const today = new Date(todayStr + 'T00:00')
    const threeDaysBeforeStart = new Date(startDate.getTime() - 3 * 24 * 60 * 60 * 1000)

    if (closeBookingDate >= startDate) {
      errors.push('Stop bookings date must be before the trip start date')
    }

    if (closeBookingDate < today) {
      errors.push('Stop bookings date cannot be in the past')
    }

    if (closeBookingDate < threeDaysBeforeStart) {
      errors.push('Stop bookings date cannot be more than 3 days before the start date')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const prepareSubmissionData = (formData: BatchFormData, tripId: string) => {
  // Datetime-local input gives YYYY-MM-DDTHH:MM in IST (browser local).
  // Append explicit +05:30 so the UTC server stores the correct UTC value.
  const toISTDateTime = (s: string) => s ? `${s}:00+05:30` : s
  const toISTDateMidnight = (s: string) => s ? `${s}T00:00:00+05:30` : s

  return {
    tripId,
    startDateTime: toISTDateTime(formData.startDateTime),
    endDateTime: toISTDateMidnight(formData.endDateTime),
    meetingPoint: formData.meetingPoint.map(point => ({
      location: point.location,
      pickupPrice: point.pickupPrice ?? 0,
    })),
    dropPoint: formData.dropPoint,
    pointOfContact: formData.pointOfContact,
    totalSeats: formData.totalSeats,
    closeBooking: toISTDateMidnight(formData.closeBooking),
    status: 'draft',
  }
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const [year, month, day] = new Date(dateString)
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    .split('-')
    .map(Number)
  const localMidnight = new Date(year, month - 1, day)
  return `${localMidnight.toLocaleDateString('en-US', { month: 'short' })} ${day}, ${year}`
}

export const formatTime = (timeString: string): string => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
