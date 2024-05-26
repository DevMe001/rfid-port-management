import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { Account, PersonalInformation } from "./types";



type PersonalDetailsReturn = {
	data: PersonalInformation[];
};

type PersonalDetailsRecord = {
	message(message: any, arg1: { variant: "success"; autoHideDuration: number; }): unknown;
	data: PersonalInformation & {
		accounts: Account;
		success: boolean;
		message: string;
	};
};


type AccountReturnData = {
	data: Account[];
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
		getPersonalDetailsById: builder.query<PersonalInformation, PersonalDetailsParams | string>({
			query: (personal_id) => `/user/personal/${personal_id}`,
			providesTags: ['PersonalDetails'],
			keepUnusedDataFor: 0,
		}),
		getAllUserNullInformation: builder.query<AccountReturnData, PersonalDetailsParams | undefined>({
			query: () => `user/fresh`,
			providesTags: ['PersonalDetails'],
			keepUnusedDataFor: 0,
		}),
		addPersonalDetails: builder.mutation<PersonalDetailsRecord, Record<string, any>>({
			query: ({ body }) => ({
				url: '/user/personal',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PersonalDetails'],
		}),

		updatePersonalDetails: builder.mutation<PersonalDetailsRecord, Partial<PersonalInformation>>({
			query: (body) => ({
				url: `/user/personal/${body.personal_id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['PersonalDetails'],
		}),
		deletePersonalDetails: builder.mutation<PersonalDetailsRecord, string>({
			query: (personal_id) => ({
				url: `/user/personal/${personal_id}`,
				method: 'DELETE',
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
		getFilterPersonalSearchTerms: builder.mutation<PersonalInformationReturnMutation, string>({
			query: (terms) => ({
				url: `/user/personal/query?terms=${terms}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['PersonalDetails'],
		}),
		getFilterByPersonalId: builder.query<PersonalDetailsRecord, PersonalDetailsParams | string>({
			query: (personal_id) => `user/personal/account?terms=${personal_id}`,
			providesTags: ['PersonalDetails'],
			keepUnusedDataFor: 0,
		}),
	}),
});

export const { useGetFilterPersonalSearchTermsMutation,useDeletePersonalDetailsMutation,useUpdatePersonalDetailsMutation,useGetAllUserNullInformationQuery,useGetPersonalDetailsByIdQuery,useAddPersonalDetailsMutation,useGetPersonalInfromationQuery , useGetFilterUserPersonalMutation,useGetFilterByPersonalIdQuery} = personalInformationService;