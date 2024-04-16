import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { PersonalInformation } from "./types";



type PersonalDetailsReturn = {
	data: PersonalInformation[];
};

export type PersonalInformationReturnMutation = {
	data: {
		data: PersonalInformation[];
	};
};

type PersonalDetailsParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: false;
};



export const personalInformationService = createApi({
	reducerPath: 'personalinformation',
	tagTypes: ['PersonalDetails'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getPersonalDetailsById: builder.query<PersonalInformation, string>({
			query: (personal_id) => `/user/personal/${personal_id}`,
			providesTags: ['PersonalDetails'],
			keepUnusedDataFor: 0,
		}),
		addPersonalDetails: builder.mutation<PersonalInformation, Record<string, any>>({
			query: ({ body }) => ({
				url: '/user/personal',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PersonalDetails'],
		}),

		getPersonalInfromation: builder.query<PersonalDetailsReturn, PersonalDetailsParams | undefined>({
			query: () => '/user/personal',
			providesTags: ['PersonalDetails'],
			keepUnusedDataFor: 0,
		}),
		getFilterUserPersonal: builder.mutation<PersonalInformationReturnMutation, string>({
			query: (terms) => ({
				url: `/user/personal/search?terms=${terms}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['PersonalDetails'],
		}),
	}),
});

export const { useGetPersonalDetailsByIdQuery,useAddPersonalDetailsMutation,useGetPersonalInfromationQuery , useGetFilterUserPersonalMutation} = personalInformationService;