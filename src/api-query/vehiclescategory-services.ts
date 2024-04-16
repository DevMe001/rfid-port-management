import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from "../immutable/constant";
import { VehicleType } from './types';


type VehicleReturn = {
	data: VehicleType[];
};

type VehicleParams = {
  pollingInterval?:boolean;
  refetchOnMountOrArgChange?:boolean,
  skip?:false
}

export const vehicleCategorieServiceApi = createApi({
	reducerPath: 'vehicle-category',
	tagTypes: ['VehicleType'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getVehicleTypes: builder.query<VehicleReturn, VehicleParams | undefined>({
			query: () => '/vehicles/categories',
			providesTags: ['VehicleType'],
			keepUnusedDataFor: 0,
		}),
		deleteVehicleById: builder.mutation<VehicleReturn, string>({
			query: (id) => ({
				url: `vehicles/categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['VehicleType'],
		}),
	}),
});


export const { useGetVehicleTypesQuery,useDeleteVehicleByIdMutation } = vehicleCategorieServiceApi;