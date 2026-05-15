import { create } from 'zustand'
import { TripFormState, TripFormData, AddOnCategory } from './types'
import { FORM_STEPS } from './constants'

const initialFormData: TripFormData = {
  title: '',
  description: '',
  type: '',
  difficulty: '',
  category: [],
  customCategories: [],
  tags: [],
  location: {
    address: '',
    city: '',
    state: '',
    country: 'India',
    latitude: null,
    longitude: null,
  },
  tripImages: [],
  faqs: [],
  pricings: [],
  addOns: [],
  cancellationPolicy: [],
  itinerary: [
    {
      id: Date.now(),
      dayNumber: 1,
      title: '',
      description: '',
      wordCount: 0,
    },
  ],
  inclusions: [],
  exclusions: [],
  thingsToCarry: [],
  highlights: [],
  additionalInfo: '',
  status: 'draft',
  isFemaleOnly: false,
  isAdvanceBookingAllowed: false,
  advanceBookingPrice: 0,
  closeAdvanceBookingDays: 0,
  bestTimeToVisit: '',
}

export const useTripFormStore = create<TripFormState>((set) => ({
  ...initialFormData,
  currentStep: 1,
  validationErrors: [],
  itineraryStartDay: 1,

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

  toggleCategory: (category) =>
    set((state) => {
      const exists = state.category.includes(category)
      return {
        category: exists
          ? state.category.filter((c) => c !== category)
          : [...state.category, category],
        validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
      }
    }),

  setCategory: (categories) =>
    set((state) => ({
      category: categories,
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  addCustomCategory: (category) =>
    set((state) => ({
      customCategories: [...state.customCategories, category],
    })),

  removeCustomCategory: (category) =>
    set((state) => ({
      customCategories: state.customCategories.filter((c) => c !== category),
      category: state.category.filter((c) => c !== category), // also remove from selected if it was selected
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
      const newDayNumber = state.itinerary.length + state.itineraryStartDay
      return {
        itinerary: [
          ...state.itinerary,
          {
            id: Date.now(),
            dayNumber: newDayNumber,
            title: '',
            description: '',
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

  removeItineraryDay: (id) =>
    set((state) => ({
      itinerary: state.itinerary
        .filter((day) => day.id !== id)
        .map((day, index) => ({ ...day, dayNumber: index + state.itineraryStartDay })),
    })),

  setItineraryStartDay: (startDay) =>
    set((state) => ({
      itineraryStartDay: startDay,
      itinerary: state.itinerary.map((day, index) => ({ ...day, dayNumber: index + startDay })),
    })),

  addInclusion: (text) =>
    set((state) => {
      if (text.trim()) {
        return {
          inclusions: [
            ...state.inclusions,
            {
              id: Date.now() + Math.random(),
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

  addHighlight: (title, image) =>
    set((state) => {
      if (title.trim()) {
        return {
          highlights: [
            ...state.highlights,
            {
              id: Date.now() + Math.random(),
              title: title.trim(),
              image: image?.trim() || undefined,
            },
          ],
          validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
        }
      }
      return state
    }),

  removeHighlight: (id) =>
    set((state) => ({
      highlights: state.highlights.filter((h) => h.id !== id),
    })),

  addExclusion: (text) =>
    set((state) => {
      if (text.trim()) {
        return {
          exclusions: [
            ...state.exclusions,
            {
              id: Date.now() + Math.random(),
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

  addThingToCarry: (text) =>
    set((state) => {
      if (text.trim()) {
        return {
          thingsToCarry: [
            ...state.thingsToCarry,
            {
              id: Date.now() + Math.random(),
              text: text.trim(),
            },
          ],
          validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
        }
      }
      return state
    }),

  removeThingToCarry: (id) =>
    set((state) => ({
      thingsToCarry: state.thingsToCarry.filter((item) => item.id !== id),
    })),

  addPricingTier: (label, pricePerPerson, description) =>
    set((state) => ({
      pricings: [
        ...state.pricings,
        {
          id: Date.now() + Math.random(),
          label: label.trim(),
          description,
          pricePerPerson,
        },
      ],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removePricingTier: (id) =>
    set((state) => ({
      pricings: state.pricings.filter((t) => t.id !== id),
    })),

  setDisplayPricingTier: (id) =>
    set((state) => {
      const index = state.pricings.findIndex((t) => t.id === id)
      if (index <= 0) return state
      const newPricings = [...state.pricings]
      const [display] = newPricings.splice(index, 1)
      newPricings.unshift(display)
      return { pricings: newPricings }
    }),

  updatePricingTier: (id, field, value) =>
    set((state) => ({
      pricings: state.pricings.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  movePricingTier: (id, direction) =>
    set((state) => {
      const idx = state.pricings.findIndex((t) => t.id === id)
      if (idx < 0) return state
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= state.pricings.length) return state
      const newPricings = [...state.pricings]
      ;[newPricings[idx], newPricings[swapIdx]] = [newPricings[swapIdx], newPricings[idx]]
      return { pricings: newPricings }
    }),

  addAddOn: (label: string, pricePerPerson: number, category?: AddOnCategory, description?: string) =>
    set((state) => ({
      addOns: [
        ...state.addOns,
        {
          id: Date.now() + Math.random(),
          label: label.trim(),
          description,
          category: category || undefined,
          pricePerPerson,
        },
      ],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeAddOn: (id) =>
    set((state) => ({
      addOns: state.addOns.filter((a) => a.id !== id),
    })),

  updateAddOn: (id, field, value) =>
    set((state) => ({
      addOns: state.addOns.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  moveAddOn: (id, direction) =>
    set((state) => {
      const addon = state.addOns.find((a) => a.id === id)
      if (!addon) return state
      // Work within items of the same category
      const category = addon.category
      const categoryItems = state.addOns.filter((a) => a.category === category)
      const catIdx = categoryItems.findIndex((a) => a.id === id)
      const swapCatIdx = direction === 'up' ? catIdx - 1 : catIdx + 1
      if (swapCatIdx < 0 || swapCatIdx >= categoryItems.length) return state
      const swapId = categoryItems[swapCatIdx].id
      // Swap in the global addOns array
      const newAddOns = [...state.addOns]
      const globalIdx = newAddOns.findIndex((a) => a.id === id)
      const globalSwapIdx = newAddOns.findIndex((a) => a.id === swapId)
      ;[newAddOns[globalIdx], newAddOns[globalSwapIdx]] = [newAddOns[globalSwapIdx], newAddOns[globalIdx]]
      return { addOns: newAddOns }
    }),

  setDefaultAddOn: (id) =>
    set((state) => {
      const addon = state.addOns.find((a) => a.id === id)
      if (!addon) return state
      const category = addon.category
      // Find first item of this category in global array
      const firstCatGlobalIdx = state.addOns.findIndex((a) => a.category === category)
      const targetGlobalIdx = state.addOns.findIndex((a) => a.id === id)
      if (firstCatGlobalIdx === targetGlobalIdx) return state
      const newAddOns = [...state.addOns]
      const [item] = newAddOns.splice(targetGlobalIdx, 1)
      newAddOns.splice(firstCatGlobalIdx, 0, item)
      return { addOns: newAddOns }
    }),

  addRefundTier: (daysBeforeCancellation, refundPercentage) =>
    set((state) => ({
      cancellationPolicy: [
        ...state.cancellationPolicy,
        { id: Date.now(), daysBeforeCancellation, refundPercentage },
      ],
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  removeRefundTier: (id) =>
    set((state) => ({
      cancellationPolicy: state.cancellationPolicy.filter((t) => t.id !== id),
    })),

  updateRefundTier: (id, field, value) =>
    set((state) => ({
      cancellationPolicy: state.cancellationPolicy.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
      validationErrors: state.validationErrors.length > 0 ? [] : state.validationErrors,
    })),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  clearValidationErrors: () => set({ validationErrors: [] }),

  resetForm: () =>
    set({
      ...initialFormData,
      currentStep: 1,
      validationErrors: [],
      itineraryStartDay: 1,
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
