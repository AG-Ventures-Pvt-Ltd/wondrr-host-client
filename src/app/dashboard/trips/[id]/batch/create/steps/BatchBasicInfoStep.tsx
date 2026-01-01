'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Calendar, Clock, MapPin, User, Phone, Users } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import { useBatchFormStore } from '../store'

const BatchBasicInfoStep: React.FC = () => {
  const { 
    startDate, 
    startTime, 
    endDate, 
    meetingPoint,
    endPoint,
    pointOfContact,
    totalSeats,
    updateField,
    updatePointOfContact
  } = useBatchFormStore()

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            Start Date
          </Label>
          <CustomInput
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            variant="input"
            min={today}
            required
          />
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            Start Time
          </Label>
          <CustomInput
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
            variant="input"
            required
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            End Date
          </Label>
          <CustomInput
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            variant="input"
            min={startDate || today}
            required
          />
        </div>
      </div>

      {/* Meeting Point */}
      <div className="space-y-2">
        <Label htmlFor="meetingPoint" className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          Meeting Point
        </Label>
        <CustomInput
          id="meetingPoint"
          placeholder="e.g., Majnu Ka Tilla, Delhi"
          value={meetingPoint}
          onChange={(e) => updateField('meetingPoint', e.target.value)}
          variant="input"
          required
        />
        <p className="text-xs text-muted-foreground">
          Specify where participants should meet for the trip
        </p>
      </div>

      {/* End Point */}
      <div className="space-y-2">
        <Label htmlFor="endPoint" className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          End Point
        </Label>
        <CustomInput
          id="endPoint"
          placeholder="e.g., Connaught Place, Delhi"
          value={endPoint}
          onChange={(e) => updateField('endPoint', e.target.value)}
          variant="input"
          required
        />
        <p className="text-xs text-muted-foreground">
          Specify where the trip will end
        </p>
      </div>

      {/* Point of Contact */}
      <div className="space-y-2">
        <Label htmlFor="pointOfContactName" className="text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-neutral-400" />
          Point of Contact Name
        </Label>
        <CustomInput
          id="pointOfContactName"
          placeholder="e.g., Rajesh Kumar"
          value={pointOfContact.name}
          onChange={(e) => updatePointOfContact('name', e.target.value)}
          variant="input"
          required
        />
        <p className="text-xs text-muted-foreground">
          Name of the person participants can contact for this batch
        </p>
      </div>

      {/* Phone Number */}
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
        <p className="text-xs text-muted-foreground">
          10-digit phone number for the point of contact
        </p>
      </div>

      {/* Total Seats */}
      <div className="space-y-2">
        <Label htmlFor="totalSeats" className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400" />
          Total Seats
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
    </div>
  )
}

export default BatchBasicInfoStep
