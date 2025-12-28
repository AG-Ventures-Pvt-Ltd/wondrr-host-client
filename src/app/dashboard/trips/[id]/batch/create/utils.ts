import { BatchFormData } from './types'
import { ValidationResult } from '@/types/common'

export const validateBatchForm = (formData: BatchFormData): ValidationResult => {
  const errors: string[] = []

  // Batch Details validations
  if (!formData.startDate.trim()) {
    errors.push('Start date is required')
  }

  if (!formData.startTime.trim()) {
    errors.push('Start time is required')
  }

  if (!formData.endDate.trim()) {
    errors.push('End date is required')
  }

  if (!formData.meetingPoint.trim()) {
    errors.push('Meeting point is required')
  }

  if (!formData.endPoint.trim()) {
    errors.push('End point is required')
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

  // Date validations
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    
    if (endDate < startDate) {
      errors.push('End date must be after start date')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const prepareSubmissionData = (formData: BatchFormData, tripId: string) => {
  return {
    ...formData,
    tripId,
    status: 'draft',
  }
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const utcDate = new Date(dateString)
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  const month = istDate.toLocaleDateString('en-US', { month: 'short' });
  const day = istDate.getDate();
  const year = istDate.getFullYear();
  return `${month} ${day}, ${year}`;
}

export const formatTime = (timeString: string): string => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
