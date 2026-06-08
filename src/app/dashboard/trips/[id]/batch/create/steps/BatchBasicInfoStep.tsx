'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/common/ui/label'
import { MapPin, User, Phone, Users, Plus, Trash2, CheckCircle2, Pencil } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import Button from '@/common/components/atoms/Button'
import LocationPickerModal, {
  type LocationPickerLocation,
} from '@/common/components/modals/LocationPickerModal'
import { useBatchFormStore } from '../store'
import { useTripBatchResources } from '../hooks'
import { useParams } from 'next/navigation'
import { SavedLocation } from '../types'

const LocationCard: React.FC<{
  location: SavedLocation
  isSelected: boolean
  onClick: () => void
  onEdit?: () => void
}> = ({ location, isSelected, onClick, onEdit }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-lg border-2 p-3 pb-7 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-300'
          : 'border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50'
      }`}
    >
      {isSelected && (
        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-blue-500 pointer-events-none" />
      )}
      <p className="text-sm font-medium text-neutral-900 pr-6 truncate">{location.name}</p>
      {(location.geo?.city || location.geo?.state) && (
        <p className="text-xs text-neutral-500 mt-0.5 truncate">
          {[location.geo.city, location.geo.state].filter(Boolean).join(', ')}
        </p>
      )}
      <span
        className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded font-medium ${
          location.category === 'meeting_point'
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}
      >
        {location.category === 'meeting_point' ? 'Meeting' : 'Drop'}
      </span>
    </button>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="absolute bottom-2 right-2 p-1 rounded-md bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors shadow-sm z-10"
        title="Edit location"
      >
        <Pencil className="w-3 h-3" />
      </button>
    )}
  </div>
)

const BatchBasicInfoStep: React.FC = () => {
  const params = useParams()
  const tripSlug = params?.id as string

  const {
    startDateTime,
    endDateTime,
    meetingPoint,
    dropPoint,
    pointOfContact,
    totalSeats,
    closeBooking,
    updateField,
    updatePointOfContact,
    updateMeetingPoint,
    addMeetingPoint,
    removeMeetingPoint,
    addDropPoint,
    removeDropPoint,
  } = useBatchFormStore()

  const { locations, totalDays, isLoading: loadingResources, refetch } =
    useTripBatchResources(tripSlug)

  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [lockCategory, setLockCategory] = useState(false)
  const [editingLocation, setEditingLocation] = useState<LocationPickerLocation | null>(null)
  const [modalDefaultCategory, setModalDefaultCategory] = useState<string>('meeting_point')

  const openAddModal = (category: string) => {
    setLockCategory(true)
    setEditingLocation(null)
    setModalDefaultCategory(category)
    setLocationModalOpen(true)
  }

  const openEditModal = (loc: SavedLocation) => {
    setLockCategory(false)
    setEditingLocation(loc as LocationPickerLocation)
    setModalDefaultCategory(loc.category)
    setLocationModalOpen(true)
  }

  const handleLocationSaved = () => {
    refetch()
  }

  // Auto-fill endDateTime when startDateTime changes and totalDays is known
  useEffect(() => {
    if (startDateTime && totalDays > 0) {
      // startDateTime from datetime-local is "YYYY-MM-DDTHH:MM" in IST
      const startIST = new Date(startDateTime + ':00+05:30')
      if (!isNaN(startIST.getTime())) {
        const end = new Date(startIST.getTime() + (totalDays - 1) * 24 * 60 * 60 * 1000)
        const endStr = end.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
        if (!endDateTime || endDateTime <= startDateTime.split('T')[0]) {
          updateField('endDateTime', endStr)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateTime, totalDays])

  const now = new Date()
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

  const getCloseBookingConstraints = () => {
    const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    if (!startDateTime) return { min: today, max: '' }
    // startDateTime is "YYYY-MM-DDTHH:MM" from datetime-local — split gives IST date directly
    const startIST = new Date(startDateTime.split('T')[0] + 'T12:00:00+05:30')
    const oneDayBefore = new Date(startIST.getTime() - 24 * 60 * 60 * 1000)
    const threeDaysBefore = new Date(startIST.getTime() - 3 * 24 * 60 * 60 * 1000)
    const minDate = threeDaysBefore > now ? threeDaysBefore : now
    return {
      min: minDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
      max: oneDayBefore.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    }
  }

  const { max: closeBookingMax } = getCloseBookingConstraints()

  const meetingPointLocations = locations.filter((l) => l.category === 'meeting_point')
  const dropPointLocations = locations.filter((l) => l.category === 'drop_point')

  return (
    <div className="space-y-6">
      {/* Start Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDateTime" className="text-sm flex items-center gap-2">
            📅 Start Date & Time
          </Label>
          <CustomInput
            id="startDateTime"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => updateField('startDateTime', e.target.value)}
            variant="input"
            min={`${todayStr}T00:00`}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDateTime" className="text-sm flex items-center gap-2">
            📅 End Date
            {totalDays > 0 && (
              <span className="text-xs text-blue-600 font-normal ml-1">
                (auto-filled from {totalDays}-day itinerary)
              </span>
            )}
          </Label>
          <CustomInput
            id="endDateTime"
            type="date"
            value={endDateTime}
            onChange={(e) => updateField('endDateTime', e.target.value)}
            variant="input"
            min={startDateTime ? startDateTime.split('T')[0] : todayStr}
            required
          />
        </div>
      </div>

      {/* Meeting Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            Meeting Points
          </Label>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => openAddModal('meeting_point')}
              variant="outlined"
              className="text-xs"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Location
            </Button>
            <Button onClick={addMeetingPoint} variant="outlined" className="text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add Meeting Point
            </Button>
          </div>
        </div>

        {meetingPoint.map((point, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 bg-neutral-50">
            <div className="flex items-end justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-neutral-700">
                Meeting Point {index + 1}
              </h4>
              {meetingPoint.length > 1 && (
                <Button
                  onClick={() => removeMeetingPoint(index)}
                  variant="text"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            {/* Location card picker */}
            {loadingResources ? (
              <p className="text-xs text-neutral-400">Loading saved locations…</p>
            ) : meetingPointLocations.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-xs text-neutral-600">Select Location</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {meetingPointLocations.map((loc) => (
                    <LocationCard
                      key={loc._id}
                      location={loc}
                      isSelected={point.location === loc._id}
                      onClick={() => updateMeetingPoint(index, 'location', loc._id)}
                      onEdit={() => openEditModal(loc)}
                    />
                  ))}
                </div>
                {point.location && (
                  <p className="text-xs text-blue-600">
                    Selected:{' '}
                    {locations.find((l) => l._id === point.location)?.name ?? point.location}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-2">
                  No meeting point locations saved yet
                </p>
                <button
                  type="button"
                  onClick={() => openAddModal('meeting_point')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add a meeting point location
                </button>
              </div>
            )}

            {/* Pickup Price */}
            <div className="space-y-2">
              <Label htmlFor={`meetingPoint-pickupPrice-${index}`} className="text-sm">
                Pickup Price (₹)
              </Label>
              <CustomInput
                id={`meetingPoint-pickupPrice-${index}`}
                type="number"
                placeholder="e.g., 500"
                value={point.pickupPrice === null ? '' : point.pickupPrice}
                onChange={(e) => updateMeetingPoint(index, 'pickupPrice', e.target.value)}
                variant="input"
                min={0}
                step={100}
                required
              />
            </div>
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Add multiple meeting points where participants can be picked up
        </p>
      </div>

      {/* Drop Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            Drop Points
          </Label>
          <Button
            onClick={() => openAddModal('drop_point')}
            variant="outlined"
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Location
          </Button>
        </div>

        {loadingResources ? (
          <p className="text-xs text-neutral-400">Loading saved locations…</p>
        ) : dropPointLocations.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-neutral-500">Click cards to select / deselect drop-off points</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {dropPointLocations.map((loc) => (
                <LocationCard
                  key={loc._id}
                  location={loc}
                  isSelected={dropPoint.includes(loc._id)}
                  onClick={() => {
                    if (dropPoint.includes(loc._id)) {
                      removeDropPoint(loc._id)
                    } else {
                      addDropPoint(loc._id)
                    }
                  }}
                  onEdit={() => openEditModal(loc)}
                />
              ))}
            </div>
            {dropPoint.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {dropPoint.map((id) => {
                  const loc = locations.find((l) => l._id === id)
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                    >
                      {loc?.name ?? id}
                      <button
                        type="button"
                        onClick={() => removeDropPoint(id)}
                        className="ml-0.5 hover:text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center">
            <p className="text-xs text-neutral-500 mb-2">No drop point locations saved yet</p>
            <button
              type="button"
              onClick={() => openAddModal('drop_point')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add a drop point location
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">Select drop-off locations for this batch</p>
      </div>

      {/* Close Booking Date */}
      <div className="space-y-2">
        <Label htmlFor="closeBooking" className="text-sm flex items-center gap-2">
          Stop Bookings Date
        </Label>
        <CustomInput
          id="closeBooking"
          type="date"
          value={closeBooking}
          onChange={(e) => updateField('closeBooking', e.target.value)}
          variant="input"
          max={closeBookingMax}
          required
        />
        <p className="text-xs text-muted-foreground">
          Last date for participants to book this batch
        </p>
      </div>

      {/* Point of Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-700">Point of Contact</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pointOfContactName" className="text-sm">
              Name
            </Label>
            <CustomInput
              id="pointOfContactName"
              placeholder="e.g., Rajesh Kumar"
              value={pointOfContact.name}
              onChange={(e) => updatePointOfContact('name', e.target.value)}
              variant="input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pointOfContactPhone" className="text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-400" />
              Phone Number
            </Label>
            <CustomInput
              id="pointOfContactPhone"
              type="tel"
              placeholder="e.g., 9876543210"
              value={pointOfContact.phone}
              onChange={(e) => updatePointOfContact('phone', e.target.value.replace(/\D/g, ''))}
              variant="input"
              maxLength={10}
              required
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Contact details for the person participants can reach for this batch
        </p>
      </div>

      {/* Total Seats */}
      <div className="space-y-2">
        <Label htmlFor="totalSeats" className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400" />
          Total Batch Capacity
        </Label>
        <CustomInput
          id="totalSeats"
          type="number"
          placeholder="e.g., 20"
          value={totalSeats === null ? '' : totalSeats}
          onChange={(e) => updateField('totalSeats', e.target.value ? Number(e.target.value) : null)}
          variant="input"
          min={1}
          required
        />
        <p className="text-xs text-muted-foreground">
          Total number of available seats for this batch
        </p>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSaved={handleLocationSaved}
        editingLocation={editingLocation}
        defaultCategory={modalDefaultCategory}
        lockCategory={lockCategory}
      />
    </div>
  )
}

export default BatchBasicInfoStep
