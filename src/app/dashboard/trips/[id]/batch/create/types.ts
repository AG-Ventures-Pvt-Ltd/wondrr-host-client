export interface PointOfContact {
  name: string
  phone: string
}

export interface BatchFormData {
  startDate: string
  startTime: string
  endDate: string
  meetingPoint: string
  endPoint: string
  pointOfContact: PointOfContact
  totalSeats: number | null
  status: 'draft' | 'published' | 'cancelled'
}

export interface BatchFormState extends BatchFormData {
  validationErrors: string[]
  updateField: <K extends keyof BatchFormData>(field: K, value: BatchFormData[K]) => void
  updatePointOfContact: (field: keyof PointOfContact, value: string) => void
  setValidationErrors: (errors: string[]) => void
  clearValidationErrors: () => void
  resetForm: () => void
  prefillFormData: (data: Partial<BatchFormData>) => void
}
