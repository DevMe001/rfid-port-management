import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from "../immutable/constant";
import { Passenger } from './types';


type PassengerReturn = {
	data: Passenger[];
};

type PassengerParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
};

export  const passengerApiService = createApi({
	reducerPath: 'passengers',
	tagTypes: ['Passenger'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getAllPassengerItem: builder.query<PassengerReturn, PassengerParams | undefined>({
			query: () => '/passengers',
			providesTags: ['Passenger'],
			keepUnusedDataFor: 0,
		}),
		deletePassengerById: builder.mutation<PassengerReturn, string>({
			query: (id) => ({
				url: `/passenger/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const { useGetAllPassengerItemQuery,useDeletePassengerByIdMutation } = passengerApiService;