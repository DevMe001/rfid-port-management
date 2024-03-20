import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';
import { BookingSchedules } from './types';

export const scheduleService = createApi({
	reducerPath: 'schedule',
	tagTypes: ['Schedule'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getBookignSchedule: builder.query<BookingSchedules[], Record<string, any>>({
			query: () => `schedule`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
		getBookignScheduleById: builder.query<BookingSchedules[], Record<string, any>>({
			query: () => `schedule`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
	}),
});

export const { useGetBookignScheduleQuery } = scheduleService;
