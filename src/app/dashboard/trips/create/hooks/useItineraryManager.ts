import { useTripFormStore } from '../store'

export const useItineraryManager = () => {
  const { 
    itinerary, 
    addItineraryDay, 
    updateItineraryDay, 
    updateItineraryTitle,
    addItineraryActivity,
    removeItineraryActivity,
    removeItineraryDay 
  } = useTripFormStore()

  return {
    itinerary,
    addItineraryDay,
    updateItineraryDay,
    updateItineraryTitle,
    addItineraryActivity,
    removeItineraryActivity,
    removeItineraryDay,
  }
}
