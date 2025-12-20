import { create } from 'zustand'
import { TripFormState, TripFormData } from './types'
import { FORM_STEPS } from './constants'

const initialFormData: TripFormData = {
  title: '',
  description: '',
  category: '',
  tags: [],
  location: {
    address: '',
    city: '',
    state: '',
    latitude: null,
    longitude: null,
  },
  tripImages: [],
  faqs: [],
  basePrice: null,
  price: null,
  itinerary: [
    {
      id: Date.now(),
      dayNumber: 1,
      title: '',
      description: '',
      activities: [],
      wordCount: 0,
    },
  ],
  inclusions: [],
  exclusions: [],
  status: 'draft',
}

export const useTripFormStore = create<TripFormState>((set) => ({
  ...initialFormData,
  currentStep: 1,
  validationErrors: [],

  setCurrentStep: (step) => set({ currentStep: step }),

  updateField: (field, value) =>
    set((state) => ({
      [field]: value,
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  updateLocationField: (field, value) =>
    set((state) => ({
      location: { ...state.location, [field]: value },
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  addTag: (tag) =>
    set((state) => {
      if (!state.tags.includes(tag) && tag.trim()) {
        return {
          tags: [...state.tags, tag.trim()],
          validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
        }
      }
      return state
    }),

  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),

  addFAQ: (question, answer) =>
    set((state) => ({
      faqs: [
        ...state.faqs,
        {
          id: Date.now(),
          question: question.trim(),
          answer: answer.trim(),
        },
      ],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeFAQ: (id) =>
    set((state) => ({
      faqs: state.faqs.filter((faq) => faq.id !== id),
    })),

  addItineraryDay: () =>
    set((state) => {
      const newDayNumber = state.itinerary.length + 1
      return {
        itinerary: [
          ...state.itinerary,
          {
            id: Date.now(),
            dayNumber: newDayNumber,
            title: '',
            description: '',
            activities: [],
            wordCount: 0,
          },
        ],
        validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
      }
    }),

  updateItineraryDay: (id, description) =>
    set((state) => {
      const wordCount = description.trim().split(/\s+/).filter((word) => word.length > 0).length
      return {
        itinerary: state.itinerary.map((day) =>
          day.id === id ? { ...day, description, wordCount } : day
        ),
        validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
      }
    }),

  updateItineraryTitle: (id, title) =>
    set((state) => ({
      itinerary: state.itinerary.map((day) =>
        day.id === id ? { ...day, title } : day
      ),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  addItineraryActivity: (id, activity) =>
    set((state) => ({
      itinerary: state.itinerary.map((day) =>
        day.id === id ? { ...day, activities: [...day.activities, activity] } : day
      ),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeItineraryActivity: (id, activityIndex) =>
    set((state) => ({
      itinerary: state.itinerary.map((day) =>
        day.id === id
          ? { ...day, activities: day.activities.filter((_, index) => index !== activityIndex) }
          : day
      ),
    })),

  removeItineraryDay: (id) =>
    set((state) => ({
      itinerary: state.itinerary
        .filter((day) => day.id !== id)
        .map((day, index) => ({ ...day, dayNumber: index + 1 })),
    })),

  addInclusion: (text) =>
    set((state) => {
      if (text.trim()) {
        return {
          inclusions: [
            ...state.inclusions,
            {
              id: Date.now(),
              text: text.trim(),
            },
          ],
          validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
        }
      }
      return state
    }),

  removeInclusion: (id) =>
    set((state) => ({
      inclusions: state.inclusions.filter((inclusion) => inclusion.id !== id),
    })),

  addExclusion: (text) =>
    set((state) => {
      if (text.trim()) {
        return {
          exclusions: [
            ...state.exclusions,
            {
              id: Date.now(),
              text: text.trim(),
            },
          ],
          validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
        }
      }
      return state
    }),

  removeExclusion: (id) =>
    set((state) => ({
      exclusions: state.exclusions.filter((exclusion) => exclusion.id !== id),
    })),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  clearValidationErrors: () => set({ validationErrors: [] }),

  resetForm: () =>
    set({
      ...initialFormData,
      currentStep: 1,
      validationErrors: [],
    }),

  prefillFormData: (data: Partial<TripFormData>) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, FORM_STEPS.length),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
}))
