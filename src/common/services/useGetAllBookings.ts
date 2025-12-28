"use client";

import { useMemo } from 'react'
import { useGetData } from './useGetData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { BookingResponse, Booking, UseGetAllBookingsReturn } from '@/app/dashboard/bookings/types'

export const useGetAllBookings = (page: number, limit: number): UseGetAllBookingsReturn => {
  const { data: bookingsResponse, isLoading, error } = useGetData<{
    data: BookingResponse[];
    total: number;
    page: number;
    limit: number;
  }>(API_ENDPOINTS.BOOKINGS.GET_HOST_BOOKINGS(page, limit))

  const bookings: Booking[] = useMemo(() => {
    if (!bookingsResponse?.data) return []

    return bookingsResponse.data.map((booking) => ({
      id: booking._id.slice(-10),
      guestName: booking.fullName,
      guestInitial: booking.fullName.charAt(0).toUpperCase(),
      destination: booking.destination,
      guests: booking.numberOfPeople,
      status: booking.status,
      bookingDate: new Date(booking.updatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      tripId: booking.tripId,
      batchId: booking.batchId,
      tripTitle: booking.tripTitle,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }))
  }, [bookingsResponse])

  return {
    bookings,
    total: bookingsResponse?.total || 0,
    page: bookingsResponse?.page || page,
    limit: bookingsResponse?.limit || limit,
    isLoading,
    error,
  }
}