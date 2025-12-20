import { create } from 'zustand'
import { BatchFormState, BatchFormData } from './types'

const initialFormData: BatchFormData = {
  startDate: '',
  startTime: '',
  endDate: '',
  meetingPoint: '',
  endPoint: '',
  pointOfContact: {
    name: '',
    phone: '',
  },
  totalSeats: null,
  status: 'draft',
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
