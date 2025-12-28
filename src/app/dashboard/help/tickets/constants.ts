export interface Ticket {
  _id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
}

// Helper function to normalize status for display
export const normalizeStatus = (status: string): 'Resolved' | 'In Progress' | 'Open' => {
  const statusMap: Record<string, 'Resolved' | 'In Progress' | 'Open'> = {
    'resolved': 'Resolved',
    'open': 'Open',
    'inprogress': 'In Progress',
    'in-progress': 'In Progress',
  };
  return statusMap[status.toLowerCase()] || 'Open';
};

export const TICKET_STATUS = {
  RESOLVED: 'Resolved',
  IN_PROGRESS: 'In Progress',
  OPEN: 'Open',
} as const;

export const SUPPORT_CATEGORIES = [
  "Refunds & Cancellations",
  "Problem Creating Trips",
  "Bug Report",
  "Feature Request",
  "Other"
];

export const STATUS_OPTIONS = [
  'All Statuses',
  'Open',
  'In Progress',
  'Resolved',
];

export const CATEGORY_OPTIONS = [
  'All Categories',
  ...SUPPORT_CATEGORIES
];
