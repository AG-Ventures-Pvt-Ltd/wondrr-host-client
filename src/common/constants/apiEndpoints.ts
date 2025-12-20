export const API_ENDPOINTS = {
  TRIPS: {
    CREATE_HOST_TRIP: 'api/client/v1/trips/host/create',
    EDIT_HOST_TRIP: (slug: string) => `api/client/v1/trips/host/trip/edit/${slug}`,
    GET_HOST_TRIPS: 'api/client/v1/trips/host/trips/me',
    GET_TRIP_DETAILS: (slug: string) => `api/client/v1/trips/host/trip/${slug}`,
    GET_TRIP_BATCHES: (slug: string) => `api/client/v1/trips/host/trip/${slug}/batches`,
    GET_BATCH_DETAILS: (batchId: string) => `api/client/v1/trips/host/trip/batch/${batchId}`,
    EDIT_BATCH: (batchId: string) => `api/client/v1/trips/host/trip/batch/edit/${batchId}`,
  },
  S3: {
    GET_PRESIGNED_URL: 'api/client/v1/s3/presigned-url',
  },
  SUPPORT: {
    CREATE_TICKET: 'api/client/v1/support/tickets/create',
  },
};