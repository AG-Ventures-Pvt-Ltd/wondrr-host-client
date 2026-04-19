'use client'

import React, { useEffect, useRef } from 'react'
import maplibregl, { Map, Marker, RequestParameters } from 'maplibre-gl'

interface MapPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

const OLA_API_KEY = process.env.NEXT_PUBLIC_OlaApi ?? ''

/** Ensure every Ola Maps request carries the api_key query param */
const transformRequest = (url: string): RequestParameters => {
  if (url.includes('olamaps.io')) {
    const separator = url.includes('?') ? '&' : '?'
    return { url: `${url}${separator}api_key=${OLA_API_KEY}` }
  }
  return { url }
}

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const styleUrl = `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${OLA_API_KEY}`

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [lng, lat],
      zoom: 13,
      transformRequest,
    })

    const marker = new maplibregl.Marker({ draggable: true, color: '#3b82f6' })
      .setLngLat([lng, lat])
      .addTo(map)

    marker.on('dragend', () => {
      const pos = marker.getLngLat()
      onChange(pos.lat, pos.lng)
    })

    map.on('click', (e) => {
      marker.setLngLat(e.lngLat)
      onChange(e.lngLat.lat, e.lngLat.lng)
    })

    mapRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return
    const cur = markerRef.current.getLngLat()
    if (Math.abs(cur.lat - lat) > 0.0001 || Math.abs(cur.lng - lng) > 0.0001) {
      markerRef.current.setLngLat([lng, lat])
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 600 })
    }
  }, [lat, lng])

  return (
    <div
      ref={containerRef}
      style={{ height: '280px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
    />
  )
}

export default MapPicker
