'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Search, MapPin } from 'lucide-react'
import Modal from '@/common/components/composites/Modal'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import { Label } from '@/common/ui/label'
import { baseAPI } from '@/common/services/baseApi'
import { notify } from '@/common/utils/notify'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'


const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false })

const DEFAULT_LAT = 20.5937
const DEFAULT_LNG = 78.9629

export interface LocationPickerLocation {
  _id: string
  name: string
  category: string
  geo?: {
    address?: string
    city?: string
    state?: string
    country?: string
    coordinates?: [number, number]
  }
}

export interface LocationPickerModalProps {
  open: boolean
  onClose: () => void
  onSaved: (location: LocationPickerLocation) => void
  editingLocation?: LocationPickerLocation | null
  defaultCategory?: string
  /** When true, category is shown read-only (used when adding from a specific section) */
  lockCategory?: boolean
}

interface OlaSuggestion {
  description: string
  mainText: string
  lat: number
  lng: number
}

interface OlaPrediction {
  description: string
  geometry: { location: { lat: number; lng: number } }
  structured_formatting?: { main_text?: string }
}

const CATEGORY_OPTIONS = [
  { value: 'meeting_point', label: 'Meeting Point' },
  { value: 'drop_point', label: 'Drop Point' },
  { value: 'destination', label: 'Destination' },
  { value: 'profile', label: 'Profile' },
]

const CATEGORY_LABELS: Record<string, string> = {
  meeting_point: 'Meeting Point',
  drop_point: 'Drop Point',
  destination: 'Destination',
  profile: 'Profile',
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  open,
  onClose,
  onSaved,
  editingLocation,
  defaultCategory = 'meeting_point',
  lockCategory = false,
}) => {
  const isEdit = !!editingLocation

  const [name, setName] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [lat, setLat] = useState(DEFAULT_LAT)
  const [lng, setLng] = useState(DEFAULT_LNG)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [locationState, setLocationState] = useState('')
  const [country, setCountry] = useState('India')
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState<OlaSuggestion[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Prevents autocomplete from re-firing after suggestion selection / reverse-geocode fill
  const didSelectRef = useRef(false)
  const reverseDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pre-fill or reset when modal opens
  useEffect(() => {
    if (!open) return

    if (editingLocation) {
      setName(editingLocation.name)
      setCategory(editingLocation.category || defaultCategory)
      setAddress(editingLocation.geo?.address ?? '')
      setCity(editingLocation.geo?.city ?? '')
      setLocationState(editingLocation.geo?.state ?? '')
      setCountry(editingLocation.geo?.country ?? 'India')
      // GeoJSON [lng, lat] → swap for map [lat, lng]
      if (editingLocation.geo?.coordinates?.length === 2) {
        setLng(editingLocation.geo.coordinates[0])
        setLat(editingLocation.geo.coordinates[1])
      } else {
        setLat(DEFAULT_LAT)
        setLng(DEFAULT_LNG)
      }
      setSearchInput(editingLocation.geo?.address ?? editingLocation.name)
    } else {
      setName('')
      setCategory(defaultCategory)
      setLat(DEFAULT_LAT)
      setLng(DEFAULT_LNG)
      setAddress('')
      setCity('')
      setLocationState('')
      setCountry('India')
      setSearchInput('')
    }
    setSuggestions([])
    setIsSaving(false)
    didSelectRef.current = false
  }, [open, editingLocation, defaultCategory])

  // Ola Maps autocomplete — skipped for one cycle after suggestion is selected
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([])
      return
    }
    if (didSelectRef.current) {
      didSelectRef.current = false
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get('https://api.olamaps.io/places/v1/autocomplete', {
          params: { input: searchInput, api_key: process.env.NEXT_PUBLIC_OlaApi },
        })
        const preds: OlaSuggestion[] = (res.data.predictions || []).map(
          (p: OlaPrediction) => ({
            description: p.description,
            mainText: p.structured_formatting?.main_text || p.description,
            lat: p.geometry.location.lat,
            lng: p.geometry.location.lng,
          })
        )
        setSuggestions(preds)
      } catch {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  /**
   * Shared reverse-geocode helper.
   * Always uses typed address_components — never guesses from description strings.
   * @param updateSearchInput  When true (map-drag), also updates the search box text.
   */
  const applyReverseGeocode = async (
    newLat: number,
    newLng: number,
    updateSearchInput: boolean
  ) => {
    try {
      const res = await axios.get('https://api.olamaps.io/places/v1/reverse-geocode', {
        params: {
          latlng: `${newLat},${newLng}`,
          api_key: process.env.NEXT_PUBLIC_OlaApi,
        },
      })
      const results = res.data.results
      if (!results?.length) return

      type Comp = { types: string[]; long_name: string }
      const comps: Comp[] = results[0].address_components ?? []

      const find = (...types: string[]) =>
        comps.find((c) => c.types.some((t) => types.includes(t)))?.long_name ?? ''

      const sublocalityVal = find('sublocality_level_1', 'sublocality', 'neighborhood')
      const localityVal    = find('locality')
      const stateVal       = find('administrative_area_level_1')

      const cleanAddress = [sublocalityVal, localityVal].filter(Boolean).join(', ')
        || localityVal
        || ''

      didSelectRef.current = true
      setAddress(cleanAddress)
      if (localityVal) setCity(localityVal)
      if (stateVal)    setLocationState(stateVal)
      if (updateSearchInput) setSearchInput(cleanAddress)
    } catch {
      // silent — form fields stay as-is
    }
  }

  const handleSuggestionSelect = (s: OlaSuggestion) => {
    didSelectRef.current = true
    setLat(s.lat)
    setLng(s.lng)
    setSearchInput(s.mainText)  // show clean place name in search box
    setSuggestions([])
    applyReverseGeocode(s.lat, s.lng, false)  // fills address/city/state from typed components
  }

  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    if (reverseDebounceRef.current) clearTimeout(reverseDebounceRef.current)
    reverseDebounceRef.current = setTimeout(() => {
      applyReverseGeocode(newLat, newLng, true)  // also updates search box
    }, 600)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      notify.error('Location name is required')
      return
    }
    if (!category) {
      notify.error('Please select a category')
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        name: name.trim(),
        category,
        geo: {
          coordinates: [lng, lat], // GeoJSON [longitude, latitude]
          address,
          city,
          state: locationState,
          country,
        },
      }
      let res
      if (isEdit && editingLocation) {
        res = await baseAPI.post(
          API_ENDPOINTS.LOCATIONS.EDIT_LOCATION(editingLocation._id),
          payload
        )
      } else {
        res = await baseAPI.post(API_ENDPOINTS.LOCATIONS.ADD_LOCATION, payload)
      }
      const saved = res.data.data as LocationPickerLocation
      notify.success(isEdit ? 'Location updated!' : 'Location added!')
      onSaved(saved)
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      notify.error(axiosErr?.response?.data?.message ?? 'Failed to save location')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Location' : 'Add Location'}
      submitText={isSaving ? 'Saving…' : isEdit ? 'Update Location' : 'Save Location'}
      cancelText="Cancel"
      onSubmit={handleSave}
      disabled={isSaving}
    >
      <div className="space-y-4 w-full min-w-[480px]">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <CustomInput
            placeholder="e.g., Bengaluru Majestic Bus Stand"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="input"
            required
          />
        </div>

        {/* Category — locked (read-only badge) when lockCategory=true */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Category</Label>
          {lockCategory ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50">
              <span className="text-sm text-neutral-700">
                {CATEGORY_LABELS[category] ?? category}
              </span>
              <span className="text-xs text-neutral-400 ml-1">(locked)</span>
            </div>
          ) : (
            <CustomSelect
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
            />
          )}
        </div>

        {/* Ola Maps search */}
        <div className="space-y-1.5 relative">
          <Label className="text-sm font-medium">Search Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city or landmark…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto border border-neutral-200 top-full mt-1">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 flex items-start gap-2"
                  onClick={() => handleSuggestionSelect(s)}
                >
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                  <span className="truncate">{s.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ola Maps interactive map */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Pin Location{' '}
            <span className="text-xs text-neutral-400 font-normal">
              (click map or drag pin to set)
            </span>
          </Label>
          <MapPicker lat={lat} lng={lng} onChange={handleMapChange} />
        </div>

        {/* Address + City + State — all auto-filled, all editable */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm font-medium">Address</Label>
            <CustomInput
              placeholder="e.g., Koramangala, Bengaluru"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">City</Label>
            <CustomInput
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">State</Label>
            <CustomInput
              placeholder="State"
              value={locationState}
              onChange={(e) => setLocationState(e.target.value)}
              variant="input"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LocationPickerModal
