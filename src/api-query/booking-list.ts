import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';
import { BookingSchedules } from './types';

export const bookingApiService = createApi({
	reducerPath: 'booking',
	tagTypes: ['Booking'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getBookignSchedule: builder.query<BookingSchedules[], Record<string, any>>({
			query: () => `booking`,
			providesTags: ['Booking'],
			keepUnusedDataFor: 0,
		}),
	}),
});

export const { useGetBookignScheduleQuery } = bookingApiService;
