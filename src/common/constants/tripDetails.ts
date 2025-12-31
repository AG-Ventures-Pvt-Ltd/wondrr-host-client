export const TRIP_DETAILS = {
  title: 'Manali Winter Wonderland',
  location: 'Manali, Himachal Pradesh',
  description: 'Experience the magical winter landscapes of Manali with snow-capped mountains, adventure activities, and cozy evenings. Perfect for families and adventure seekers alike.',
  image: 'https://placehold.co/1093x286',
  category: 'Mountains',
  categoryType: 'trip type'
};

export const TRIP_STATS = {
  totalRevenue: {
    value: '₹259,000',
    subtitle: '3 batches',
    icon: 'TrendingUp'
  },
  seatsFilled: {
    value: '30/45',
    subtitle: '67% occupancy',
    icon: 'Users'
  },
  totalBatches: {
    value: '3',
    subtitle: 'scheduled',
    icon: 'Calendar'
  },
  category: {
    value: 'Mountains',
    subtitle: 'trip type',
    icon: 'Tag'
  }
};

export const TRIP_BATCHES = [
  {
    id: 1,
    date: 'Dec 24, 2024',
    status: 'Active',
    statusColor: 'green',
    duration: 'Dec 24, 2024 - Dec 27, 2024 • 3D/2N',
    priceRange: '₹8,500 - ₹9,500',
    seats: '12/15',
    revenue: '₹102,000',
    occupancy: '80%'
  },
  {
    id: 2,
    date: 'Dec 26, 2024',
    status: 'Active',
    statusColor: 'green',
    duration: 'Dec 26, 2024 - Dec 29, 2024 • 3D/2N',
    priceRange: '₹8,500 - ₹9,500',
    seats: '10/15',
    revenue: '₹85,000',
    occupancy: '67%'
  },
  {
    id: 3,
    date: 'Jan 5, 2025',
    status: 'Filling',
    statusColor: 'amber',
    duration: 'Jan 5, 2025 - Jan 8, 2025 • 3D/2N',
    priceRange: '₹9,000 - ₹10,000',
    seats: '8/15',
    revenue: '₹72,000',
    occupancy: '53%'
  }
];

export const TRIP_TAGS = [
  'Snow',
  'Adventure',
  'Winter',
  'Family-Friendly',
  'Photography',
  'Nature'
];

export const TRIP_FAQS = [
  {
    question: 'What is the best time to visit?',
    answer: 'December to February is ideal for snow activities.'
  },
  {
    question: 'Is it suitable for kids?',
    answer: 'Yes, most activities are family-friendly with supervision.'
  }
];

export const CANCELLATION_POLICY = {
  filename: 'cancellation-policy-manali.pdf',
  displayName: 'cancellation-policy-manali.pdf'
};
