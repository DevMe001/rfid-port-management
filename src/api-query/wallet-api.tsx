import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { Ewallet, EwalletPersonalInformation } from "./types";

export type WalletReturn = {
	data: Ewallet[];
};




export type WalleteReturnMutation = {
	data: {
		data: Ewallet[];
	};
};

export type WalletPollingParams = {
	pollingInterval?: boolean;
	refetchOnMountOrArgChange?: boolean;
	skip?: boolean;
};


type WalletParams={
	terms:string;
	code:string;
	personal_id:string;
}

export const walletApiService = createApi({
	reducerPath: 'ewallet',
	tagTypes: ['Wallet'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getEwalletAccount: builder.query<WalletReturn, WalletPollingParams | undefined>({
			query: () => '/wallet',
			providesTags: ['Wallet'],
			keepUnusedDataFor: 0,
		}),

		getFilterEwalletByd: builder.query<EwalletPersonalInformation, WalletPollingParams | string>({
			query: (id) => `wallet/${id}`,
			providesTags: ['Wallet'],
			keepUnusedDataFor: 0,
		}),

		deleteWalletAccount: builder.mutation<WalletReturn, string>({
			query: (id) => ({
				url: `/wallet/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Wallet'],
		}),

		getFilterEwallet: builder.mutation<WalleteReturnMutation, string>({
			query: (terms) => ({
				url: `/wallet/search?terms=${terms}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Wallet'],
		}),

		getFilterEwalletByWalletIdentity: builder.mutation<Ewallet, string>({
			query: (terms) => ({
				url: `/wallet/${terms}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Wallet'],
		}),
		getVerifyBalanceAccount: builder.mutation<WalleteReturnMutation, WalletParams>({
			query: ({ terms, code, personal_id }) => ({
				url: `/wallet/verify/${code}?terms=${terms}&personal_id=${personal_id}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Wallet'],
		}),
	}),
});

export const {useGetFilterEwalletBydQuery,useGetEwalletAccountQuery,useDeleteWalletAccountMutation,useGetFilterEwalletMutation,useGetVerifyBalanceAccountMutation,useGetFilterEwalletByWalletIdentityMutation} = walletApiService;