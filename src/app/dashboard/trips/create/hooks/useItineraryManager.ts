import { useTripFormStore } from '../store'

export const useItineraryManager = () => {
  const { 
    itinerary, 
    addItineraryDay, 
    updateItineraryDay, 
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  } = useTripFormStore()

  return {
    itinerary,
    addItineraryDay,
    updateItineraryDay,
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  }
}
