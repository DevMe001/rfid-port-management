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
			providesTags:['Booking'],
			keepUnusedDataFor:0
		}),
	}),
});

export const { useGetBookignScheduleQuery,useGetSeatTakenQuery } = bookingApiService;
