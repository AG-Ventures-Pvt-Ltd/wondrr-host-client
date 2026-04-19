export interface PointOfContact {
  name: string
  phone: string
}

export interface MeetingPoint {
  location: string
  pickupPrice: number | null
}

export interface SavedLocationGeo {
  address?: string
  city?: string
  state?: string
  country?: string
  coordinates?: [number, number]
}

export interface SavedLocation {
  _id: string
  name: string
  category: 'meeting_point' | 'drop_point'
  geo?: SavedLocationGeo
}

export interface TripBatchResources {
  locations: SavedLocation[]
  totalDays: number
}

export interface BatchFormData {
  startDateTime: string
  endDateTime: string
  meetingPoint: MeetingPoint[]
  dropPoint: string[]
  pointOfContact: PointOfContact
  totalSeats: number | null
  status: 'draft' | 'published' | 'cancelled'
  closeBooking: string
}

export interface BatchFormState extends BatchFormData {
  validationErrors: string[]
  updateField: <K extends keyof BatchFormData>(field: K, value: BatchFormData[K]) => void
  updatePointOfContact: (field: keyof PointOfContact, value: string) => void
  updateMeetingPoint: (index: number, field: keyof MeetingPoint, value: string | number) => void
  addMeetingPoint: () => void
  removeMeetingPoint: (index: number) => void
  addDropPoint: (locationId: string) => void
  removeDropPoint: (locationId: string) => void
  setValidationErrors: (errors: string[]) => void
  clearValidationErrors: () => void
  resetForm: () => void
  prefillFormData: (data: Partial<BatchFormData>) => void
}
