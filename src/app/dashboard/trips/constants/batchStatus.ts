export const BATCH_STATUS = {
  DRAFT: 'draft',
  AVAILABLE: 'available',
  FILLING_FAST: 'filling-fast',
  SOLD_OUT: 'sold-out',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export type BatchStatus = (typeof BATCH_STATUS)[keyof typeof BATCH_STATUS];
