import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';
import { BookingSchedules, Booking } from './types';

type BookingReturn = {
	data: BookingSchedules[] | Booking[];
};

type BookingParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: false;
};


interface ScheduleInfo {
	origin: string;
	destination: string;
	arrival_date: string;
	createdAt: string;
}

export interface BookingInfo {
	book_id: string;
	schedule: ScheduleInfo;
}


export const bookingApiService = createApi({
	reducerPath: 'booking',
	tagTypes: ['Booking'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getBookignSchedule: builder.query<BookingReturn, BookingParams | undefined>({
			query: () => `booking`,
			providesTags: ['Booking'],
			keepUnusedDataFor: 0,
		}),
		getSeatTaken: builder.query<BookingReturn, BookingParams | undefined>({
			query: () => 'booking/seats',
			providesTags: ['Booking'],
			keepUnusedDataFor: 0,
		}),
		getBookingScheduledByUser: builder.mutation<Partial<BookingInfo[]>, string>({
			query: (personal_id) => ({
				url: `/booking/user/${personal_id}`,
				method: 'GET',
				providesTags: ['Booking'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Booking'],
		}),

		deleteBookingById: builder.mutation<Partial<BookingInfo[]>, string>({
			query: (bookId) => ({
				url: `/booking/${bookId}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Booking'],
		}),
	}),
});

export const { useGetBookignScheduleQuery,useGetSeatTakenQuery,useGetBookingScheduledByUserMutation,useDeleteBookingByIdMutation } = bookingApiService;
