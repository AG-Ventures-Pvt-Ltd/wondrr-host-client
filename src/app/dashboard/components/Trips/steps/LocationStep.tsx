'use client'

import React from 'react'
import { Input } from '@/common/ui/input'
import { Label } from '@/common/ui/label'
import { Card } from '@/common/ui/card'
// import Map from '@/common/ui/Map'
// import LocationSearch from '@/common/components/composites/LocationSearch'


const LocationStep = ({ formData, updateNestedFormData }) => {
  // const handleLocationSelect = (locationData) => {
  //   // Update form data with selected location
  //   updateNestedFormData('location', 'latitude', locationData.coordinates.lat)
  //   updateNestedFormData('location', 'longitude', locationData.coordinates.lng)
  //   updateNestedFormData('location', 'city', locationData.city)
  //   updateNestedFormData('location', 'state', locationData.state)
  //   updateNestedFormData('location', 'address', locationData.address)
  // }

  return (
    <div className="space-y-6">
      {/* Location Search */}
      {/* <LocationSearch
        onLocationSelect={handleLocationSelect}
        label="Search & Select Location"
        placeholder="Search for a place, city, or address..."
        required
      /> */}

      {/* Map with Selected Location */}
      {/* <Card className="p-6 bg-gray-50">
        <Map
          latitude={formData.location.latitude}
          longitude={formData.location.longitude}
        />
      </Card> */}

      {/* Address Details */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          placeholder="Enter address manually"
          value={formData.location.address || ''}
          onChange={(e) => updateNestedFormData('location', 'address', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            placeholder="e.g., Mumbai"
            value={formData.location.city || ''}
            onChange={(e) => updateNestedFormData('location', 'city', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium">
            State <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            placeholder="e.g., Maharashtra"
            value={formData.location.state || ''}
            onChange={(e) => updateNestedFormData('location', 'state', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )
}

export default LocationStep
