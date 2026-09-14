import { useTripFormStore } from '../store'

export const useItineraryManager = () => {
  const { 
    itinerary, 
    addItineraryDay, 
    addItineraryPoints,
    removeItineraryPoint,
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  } = useTripFormStore()

  return {
    itinerary,
    addItineraryDay,
    addItineraryPoints,
    removeItineraryPoint,
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  }
}
