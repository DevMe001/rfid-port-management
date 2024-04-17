import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from "../immutable/constant";
import { Vehicles } from "./types";

export type QueryResultType = {
	data: Partial<Vehicles[]>;
	error: string | null;
	isLoading: boolean; 
	isSuccess: boolean;
	isError: boolean;
};


export type VehicleIds = {
	vehicle_id: string;
	vehicle_name: string;
	vehicle_photo: string;
};

export type QueryResultTypeVehiclesId = {
	data: Partial<VehicleIds[]>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};

interface QueryOptionsWithPolling  {
	pollingInterval?: number;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
} 


export const vehiclesApiService = createApi({
	reducerPath: 'vehicles',
	tagTypes: ['Vehicles'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getVehicleRecord: builder.query<QueryResultType, QueryOptionsWithPolling | undefined>({
			query: () => '/vehicles',
			providesTags: ['Vehicles'],
			keepUnusedDataFor: 0,
		}),
		getVehicleIdList: builder.query<QueryResultTypeVehiclesId, QueryOptionsWithPolling | undefined>({
			query: () => '/vehiclesIds',
			providesTags: ['Vehicles'],
			keepUnusedDataFor: 0,
		}),
		newVehicle: builder.mutation<QueryResultType, FormData>({
			query: (body) => ({
				url: '/vehicles',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Vehicles'],
		}),
		updateVehicle: builder.mutation<QueryResultType, Vehicles>({
			query: (vehicle) => ({
				url: `/vehicles/${vehicle.vehicle_id}`,
				method: 'PUT',
				vehicle,
			}),
			invalidatesTags: ['Vehicles'],
		}),
		deleteVehicle: builder.mutation<QueryResultType, string>({
			query: (vehicle_id) => ({
				url: `/vehicle/${vehicle_id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Vehicles'],
		}),
	}),
});


export const {useGetVehicleRecordQuery,useNewVehicleMutation,useUpdateVehicleMutation,useDeleteVehicleMutation,useGetVehicleIdListQuery} = vehiclesApiService;

