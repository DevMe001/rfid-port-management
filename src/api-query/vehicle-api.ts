import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from "../immutable/constant";
import { VehicleType, Vehicles } from "./types";

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


export type QueryResultTypeVehicles = {
	data: Partial<VehicleType[]>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};

export type QueryResultTypeVehiclesId = {
	data: Partial<VehicleIds[]>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};

interface QueryOptionsWithPolling {
	pollingInterval?: number;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
} 


export type VehicleTypeReturnMutation = {
	data: {
		data: VehicleType[];
	};
};


export const vehiclesApiService = createApi({
	reducerPath: 'vehicles',
	tagTypes: ['VEHICLE'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getVehicleRecord: builder.query<QueryResultType, QueryOptionsWithPolling | undefined>({
			query: () => '/vehicles',
			providesTags: ['VEHICLE'],
			keepUnusedDataFor: 0,
		}),
		getVehicleIdList: builder.query<QueryResultTypeVehiclesId, QueryOptionsWithPolling | undefined>({
			query: () => '/vehiclesIds',
			providesTags: ['VEHICLE'],
			keepUnusedDataFor: 0,
		}),
		newVehicle: builder.mutation<QueryResultType, FormData>({
			query: (body) => ({
				url: '/vehicles',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		updateVehicle: builder.mutation<QueryResultType, FormData>({
			query: (body) => ({
				url: '/vehicle/modify',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		// updateVehicle: builder.mutation<QueryResultType, Partial<Vehicles> | FormData>({
		// 	query: (vehicle) => {
		// 		let url = '/vehicle';

		// 		// Extract vehicle_id from FormData if available
		// 		let vehicleId: string | undefined;
		// 		if (vehicle instanceof FormData) {
		// 			vehicleId = vehicle.get('vehicle_id') as string | undefined;
		// 		}

		// 		// If vehicle_id is available, update the URL and method
		// 		if (vehicleId) {
		// 			url += `/${vehicleId}`;

		// 		}

		// 		return {
		// 			url,
		// 		method: 'PATCH',
		// 			body: vehicle,
		// 			// Add headers if needed, e.g., 'Content-Type': 'multipart/form-data'
		// 		};
		// 	},
		// 	invalidatesTags: ['VEHICLE'],
		// }),

		deleteVehicle: builder.mutation<QueryResultType, string>({
			query: (vehicle_id) => ({
				url: `/vehicle/${vehicle_id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		filterVehicleQuery: builder.mutation<string, string>({
			query: (query) => ({
				url: `/vehicle/search/${query}`,
				method: 'GET',
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		filterVehicleType: builder.mutation<VehicleTypeReturnMutation, string>({
			query: (query) => ({
				url: `/vehicletype/search/${query}`,
				method: 'GET',
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		newVehicleType: builder.mutation<QueryResultTypeVehicles, Partial<VehicleType>>({
			query: (body) => ({
				url: '/vehiclestype',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['VEHICLE'],
		}),
		updateVehicleType: builder.mutation<QueryResultTypeVehicles, Partial<VehicleType>>({
			query: (body) => ({
				url: `/vehiclestype/${body.vehicletype_id}`,
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['VEHICLE'],
		}),
	}),
});


export const {useFilterVehicleTypeMutation,useNewVehicleTypeMutation,useUpdateVehicleTypeMutation,useGetVehicleRecordQuery,useNewVehicleMutation,useUpdateVehicleMutation,useDeleteVehicleMutation,useGetVehicleIdListQuery,useFilterVehicleQueryMutation} = vehiclesApiService;

