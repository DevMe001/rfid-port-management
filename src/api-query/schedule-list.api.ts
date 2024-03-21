import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';
import { BookingSchedules, VehicleType } from './types';

export const scheduleService = createApi({
	reducerPath: 'schedule',
	tagTypes: ['Schedule', 'VehicleType'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getBookingSchedule: builder.query<BookingSchedules[], Record<string, any>>({
			query: () => `schedule`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
		getBookingScheduleById: builder.query<BookingSchedules[], Record<string, any>>({
			query: () => `schedule`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
		getBookingVehicleType: builder.query<VehicleType[], Record<string, any>>({
			query: () => `vehicles/types`,
			providesTags: ['VehicleType'],
			keepUnusedDataFor: 0,
		}),
	}),
});

export const { useGetBookingScheduleQuery,useGetBookingVehicleTypeQuery } = scheduleService;
