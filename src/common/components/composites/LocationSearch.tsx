'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/common/ui/input'
import { Label } from '@/common/ui/label'
import { Search } from 'lucide-react'

interface LocationData {
  coordinates: {
    lat: number
    lng: number
  }
  city: string
  state: string
  address: string
  location: string
}

interface LocationSuggestion {
  city: string
  state: string
  lat: number
  lng: number
  fullAddress: string
}

interface PredictionTerm {
  offset: number
  value: string
}

interface Prediction {
  terms: PredictionTerm[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  description: string
}

interface LocationSearchProps {
  onLocationSelect?: (location: LocationData) => void
  label?: string
  placeholder?: string
  required?: boolean
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  label = "Search Location",
  placeholder = "Search for a city",
  required = false 
}) => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])

  useEffect(() => {
    if (input.trim() === '') {
      return
    }

    const fetchSuggestions = setTimeout(() => {
      axios
        .get(`https://api.olamaps.io/places/v1/autocomplete`, {
          params: {
            input: input,
            api_key: process.env.NEXT_PUBLIC_OlaApi,
          },
        })
        .then((response) => {
          const filteredSuggestions = response.data.predictions.map((prediction: Prediction) => {
            const city = prediction.terms.find((term: PredictionTerm) => term.offset === 0)?.value
            const state = prediction.terms.find((term: PredictionTerm) => term.offset > 0)?.value

            console.log('Prediction:', response.data.predictions);
            return {
              city: city || '',
              state: state || '',
              lat: prediction.geometry.location.lat,
              lng: prediction.geometry.location.lng,
              fullAddress: prediction.description || `${city}, ${state}`,
            }
          })
          setSuggestions(filteredSuggestions)
        })
        .catch((error) => {
          console.error('Error fetching location data', error)
          setSuggestions([])
        })
    }, 300)

    return () => clearTimeout(fetchSuggestions)
  }, [input])

  const handleSelectLocation = (location: LocationSuggestion) => {
    setInput(location.fullAddress)
    setSuggestions([])
    
    // Pass data to parent component
    if (onLocationSelect) {
      onLocationSelect({
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
        city: location.city,
        state: location.state,
        address: location.fullAddress,
        location: `${location.city}, ${location.state}`,
      })
    }
  }

  return (
    <div className="space-y-2 relative">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
      
      {suggestions.length > 0 && (
        <div
          className="absolute z-10 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border"
          style={{
            boxShadow:
              'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectLocation(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === 0 ? 'bg-gray-100' : ''
              }`}
            >
              {suggestion.city}, {suggestion.state}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationSearch
