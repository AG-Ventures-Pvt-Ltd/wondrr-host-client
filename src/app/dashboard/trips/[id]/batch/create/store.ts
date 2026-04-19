import { create } from 'zustand'
import { BatchFormState, BatchFormData, MeetingPoint } from './types'

const initialFormData: BatchFormData = {
  startDateTime: '',
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
