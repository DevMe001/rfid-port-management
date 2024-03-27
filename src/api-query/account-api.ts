import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { UploadFile, Account } from './types';
import { IUser } from "../utils/redux/slicer/authSlice";

export const accountProfileServices = createApi({
	reducerPath: 'account',
	tagTypes: ['Account'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getProfileAccount: builder.query<Account, string>({
			query: (account_id) => `/account/${account_id}`,
			providesTags: ['Account'],
			keepUnusedDataFor: 0,
		}),
		updateProfileAvatar: builder.mutation<UploadFile, { id: IUser['id']; data: FormData }>({
			query: ({ id, data }) => ({
				url: `/account/upload/${id}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Account'],
		}),
	}),
});

export const { useUpdateProfileAvatarMutation,useGetProfileAccountQuery } = accountProfileServices;