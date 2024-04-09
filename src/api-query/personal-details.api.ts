import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { PersonalInformation } from "./types";

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
		addPersonalDetails: builder.mutation<PersonalInformation, Record<string,any>>({
			query: ({body}) => ({
				url:'/user/personal',
				method:"POST",
				body
			}),
			invalidatesTags: ['PersonalDetails'],
		}),
	}),
});

export const { useGetPersonalDetailsByIdQuery,useAddPersonalDetailsMutation } = personalInformationService;