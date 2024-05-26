import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { RFIDSlotDto } from './types';



type RFIDSlotDtoReturn = {
	data: RFIDSlotDto[];
};

type RFIDParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
};




export const rfidApiService = createApi({
	reducerPath: 'rfid-slot',
	tagTypes: ['SLOT'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getRfidSlotAvailable: builder.query<any, any>({
			query: () => '/rfid-slot',
			providesTags: ['SLOT'],
			keepUnusedDataFor: 0,
		}),
		getTotalRFIDSlot: builder.query<RFIDSlotDto, RFIDParams | undefined>({
			query: () => '/rfid-slot/count',
			providesTags: ['SLOT'],
			keepUnusedDataFor: 0,
		}),
		newRFIDSlot: builder.mutation<RFIDSlotDto, RFIDSlotDto>({
			query: (body) => ({
				url: '/rfid-slot',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['SLOT'],
		}),
		deleteRfIdSlot: builder.mutation<RFIDSlotDto['rfid_id'], string>({
			query: (deleteID) => ({
				url: `/rfid-slot/${deleteID}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['SLOT'],
		}),

		filterRfidQuery: builder.mutation<string, string>({
			query: (query) => ({
				url: `/rfid/search?terms=${query}`,
				method: 'GET',
			}),
			invalidatesTags: ['SLOT'],
		}),
	}),
});


export const {useNewRFIDSlotMutation,useGetRfidSlotAvailableQuery,useDeleteRfIdSlotMutation,useFilterRfidQueryMutation,useGetTotalRFIDSlotQuery} = rfidApiService;