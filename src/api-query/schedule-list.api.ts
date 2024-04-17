import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';
import { BookingSchedules, Schedules, VehicleType } from './types';

export type ScheduleReturn={
	data:Schedules[]
}

export type ScheduleReturnMutation = {
	data: {
		data: Schedules[];
	};
};
 type SchedulePoolingParams={
	pollingInterval:boolean;
	refetchOnMountOrArgChange:boolean;
	skip:boolean;
 }

 export interface PostSchedule {
		origin: string;
		destination?: string;
		seatRange?: string;
		vehicle_id?: string;
 }

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
		getBookingScheduleAdmin: builder.query<ScheduleReturn, SchedulePoolingParams | undefined>({
			query: () => `schedule`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
		getBookingScheduleById: builder.query<BookingSchedules, string>({
			query: (scheduleId) => `schedule/${scheduleId}`,
			providesTags: ['Schedule'],
			keepUnusedDataFor: 0,
		}),
		getBookingVehicleType: builder.query<VehicleType[], Record<string, any>>({
			query: () => `vehicles/types`,
			providesTags: ['VehicleType'],
			keepUnusedDataFor: 0,
		}),
		deleteScheduleById: builder.mutation<ScheduleReturn, string>({
			query: (id) => ({
				url: `/schedule/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Schedule'],
		}),
		getFilterSchedule: builder.mutation<ScheduleReturnMutation, string>({
			query: (terms) => ({
				url: `/schedule/search?terms=${terms}`,
				method: 'GET',
				providesTags: ['Schedule'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Schedule'],
		}),
		newSchedule: builder.mutation<ScheduleReturnMutation, PostSchedule>({
			query: (body) => ({
				url: `/schedule`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Schedule'],
		}),
	}),
});

export const { useNewScheduleMutation, useGetBookingScheduleQuery, useGetBookingVehicleTypeQuery, useGetBookingScheduleByIdQuery, useGetBookingScheduleAdminQuery, useDeleteScheduleByIdMutation, useGetFilterScheduleMutation } = scheduleService;
