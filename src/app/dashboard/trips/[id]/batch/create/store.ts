import { create } from 'zustand'
import { BatchFormState, BatchFormData } from './types'

const initialFormData: BatchFormData = {
  startDateTime: (() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T00:00` // Current date with time set to 00:00
  })(), // Current local date with default time 00:00
  endDateTime: '',
  meetingPoint: [
    {
      location: '',
      pickupPrice: null,
    }
  ],
  dropPoint: [],
  pointOfContact: {
    name: '',
    phone: '',
  },
  totalSeats: null,
  status: 'draft',
  closeBooking: '',
}

export const useBatchFormStore = create<BatchFormState>((set) => ({
  ...initialFormData,
  validationErrors: [],

  updateField: (field, value) =>
    set((state) => ({
      [field]: value,
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  updatePointOfContact: (field, value) =>
    set((state) => ({
      pointOfContact: { ...state.pointOfContact, [field]: value },
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  updateMeetingPoint: (index, field, value) =>
    set((state) => {
      const updatedMeetingPoints = [...state.meetingPoint]
      updatedMeetingPoints[index] = {
        ...updatedMeetingPoints[index],
        [field]: field === 'pickupPrice' ? (value === '' ? null : Number(value)) : value,
      }
      return {
        meetingPoint: updatedMeetingPoints,
        validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
      }
    }),

  addMeetingPoint: () =>
    set((state) => ({
      meetingPoint: [
        ...state.meetingPoint,
        {
          location: '',
          pickupPrice: null,
        }
      ],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeMeetingPoint: (index) =>
    set((state) => ({
      meetingPoint: state.meetingPoint.filter((_, i) => i !== index),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  addDropPoint: (locationId: string) =>
    set((state) => ({
      dropPoint: [...state.dropPoint, locationId],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeDropPoint: (locationId: string) =>
    set((state) => ({
      dropPoint: state.dropPoint.filter(id => id !== locationId),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  clearValidationErrors: () => set({ validationErrors: [] }),

  resetForm: () =>
    set({
      ...initialFormData,
      validationErrors: [],
    }),

  prefillFormData: (data) =>
    set((state) => ({
      ...state,
      ...data,
      validationErrors: [],
    })),
}))
