export const API_ENDPOINTS = {
  TRIPS: {
    CREATE_HOST_TRIP: 'api/client/v1/trips/host/create',
    CREATE_HOST_BATCH : 'api/client/v1/trips/host/trip/batch/create',
    EDIT_HOST_TRIP: (slug: string) => `api/client/v1/trips/host/trip/edit/${slug}`,
    GET_HOST_TRIPS: 'api/client/v1/trips/host/trips/me',
    GET_TRIP_DETAILS: (slug: string) => `api/client/v1/trips/host/trip/${slug}`,
    GET_TRIP_BATCHES: (slug: string, page: number, limit: number) => `api/client/v1/trips/host/trip/${slug}/batches?page=${page}&limit=${limit}`,
    GET_BATCH_DETAILS: (batchId: string) => `api/client/v1/trips/host/trip/batch/${batchId}`,
    EDIT_BATCH: (batchId: string) => `api/client/v1/trips/host/trip/batch/edit/${batchId}`,
  },
  BOOKINGS: {
    GET_HOST_BOOKINGS: (page: number, limit: number, tripId?: string, batchId?: string) => {
      let url = `api/client/v1/bookings/host?page=${page}&limit=${limit}`;
      if (tripId && tripId !== 'all') url += `&tripId=${tripId}`;
      if (batchId && batchId !== 'all') url += `&batchId=${batchId}`;
      return url;
    },
    GET_TRIP_BATCH_MAPS: 'api/client/v1/trips/host/trip-batch-maps',
  },
  S3: {
    GET_PRESIGNED_URL: 'api/client/v1/s3/presigned-url',
  },
  SUPPORT: {
    CREATE_TICKET: 'api/client/v1/support/tickets/create',
    GET_MY_TICKETS: 'api/client/v1/support/tickets/me',
  },
  PROFILE: {
    GET_HOST_PROFILE: 'api/client/v1/user/host/me',
    UPDATE_BASIC_INFO: 'api/client/v1/user/host/profile/update',
  },
  HOME: {
    GET_HOST_HOME_STATS: 'api/client/v1/landingpage/host/home/me',
    GET_UPCOMING_BATCHES: (limit? : number) => `api/client/v1/trips/host/batches/me?limit=${limit}`,
  },
  DISCOUNTS : {
    CREATE_COUPON: 'api/client/v1/discounts/host/create',
    GET_HOST_COUPONS: (page : number, limit :number) => `api/client/v1/discounts/host/me?page=${page}&limit=${limit}`,
    DEACTIVATE_COUPON: (couponId: string) => `api/client/v1/discounts/host/deactivate/${couponId}`,
  },
  SCHEDULE: {
    GET_MONTH_SCHEDULE: (month: string) => `api/client/v1/trips/host/schedule/${month}`,
  }
};