'use client';

import React, { useState, useMemo } from 'react';
import TicketHeader from './components/TicketHeader';
import TicketFilters from './components/TicketFilters';
import TicketCard from './components/TicketCard';
import SupportTicketModal from './components/SupportTicketModal';
import { TICKET_STATUS } from './constants';
import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import type { Ticket } from './constants';

export default function TicketsPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Fetch tickets from API
  const { data: tickets, isLoading } = useGetData<Ticket[]>(
    API_ENDPOINTS.SUPPORT.GET_MY_TICKETS
  );

  // Filter tickets based on selected filters
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter((ticket) => {
      const yearMatch = ticket.createdAt.includes(selectedYear);
      const monthMatch =
        selectedMonth === 'All Months' ||
        ticket.createdAt.includes(selectedMonth.slice(0, 3));
      return yearMatch && monthMatch;
    });
  }, [tickets, selectedYear, selectedMonth]);

  // Calculate stats
  const totalTickets = filteredTickets.length;
  const resolvedTickets = filteredTickets.filter(
    (ticket) => ticket.status === TICKET_STATUS.RESOLVED
  ).length;

  const handleRaiseTicket = () => {
    setTicketModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <TicketHeader onRaiseTicket={handleRaiseTicket} />

      {/* Title Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl text-neutral-900 font-medium">
          Support Ticket History
        </h2>
        <p className="text-base text-neutral-500">
          View all your support tickets and their status
        </p>
      </div>

      {/* Filters Section */}
      <TicketFilters
        selectedStatus={'All Statuses'}
        selectedCategory={'All Categories'}
        onStatusChange={() => {}}
        onCategoryChange={() => {}}
        totalTickets={totalTickets}
        resolvedTickets={resolvedTickets}
      />

      {/* Tickets List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200/60">
            <p className="text-neutral-500">Loading tickets...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200/60">
            <p className="text-neutral-500">
              {tickets?.length === 0 ? 'No tickets found' : 'No tickets found for the selected period'}
            </p>
          </div>
        )}
      </div>

      {/* Support Ticket Modal */}
      <SupportTicketModal 
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />
    </div>
  );
}
