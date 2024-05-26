import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { UploadFile, Account } from './types';
import { IUser } from "../utils/redux/slicer/authSlice";

type AccountReturn={
	data:Account[]
}

 type AccountParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
};


export type AccountReturnMutation = {
	data: {
		data: AccountReturn[];
	};
};
type AccountPoolingParams = {
	pollingInterval: boolean;
	refetchOnMountOrArgChange: boolean;
	skip: boolean;
};


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

		getProfileAdminRole: builder.query<Account, undefined>({
			query: () => '/account/role',
			providesTags: ['Account'],
			keepUnusedDataFor: 0,
		}),
		getAccounts: builder.query<AccountReturn, AccountParams | undefined>({
			query: () => 'accounts',
			providesTags: ['Account'],
			keepUnusedDataFor: 0,
		}),

		filterAccountDetails: builder.mutation<AccountReturnMutation, string>({
			query: (query) => ({
				url: `/account/search/${query}`,
				method: 'GET',
			}),
			invalidatesTags: ['Account'],
		}),
		newAccountDetails: builder.mutation<AccountReturnMutation, FormData>({
			query: (body) => ({
				url: '/account/add',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Account'],
		}),
		updateAccountDetails: builder.mutation<AccountReturnMutation, FormData>({
			query: (body) => ({
				url: `/account/update`,
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['Account'],
		}),
		deleteAccountDetails: builder.mutation<AccountReturnMutation, string>({
			query: (account_id) => ({
				url: `/account/destroy/${account_id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Account'],
		}),
	}),
});

export const {useDeleteAccountDetailsMutation, useUpdateProfileAvatarMutation,useGetProfileAccountQuery,useGetProfileAdminRoleQuery,useGetAccountsQuery,useNewAccountDetailsMutation,useUpdateAccountDetailsMutation,useFilterAccountDetailsMutation } = accountProfileServices;