import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { Ewallet } from "./types";

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
		getVerifyBalanceAccount: builder.mutation<WalleteReturnMutation, WalletParams>({
			query: ({ terms, code }) => ({
				url: `/wallet/${code}?terms=${terms}`,
				method: 'GET',
				providesTags: ['Wallet'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['Wallet'],
		}),
	}),
});

export const {useGetEwalletAccountQuery,useDeleteWalletAccountMutation,useGetFilterEwalletMutation,useGetVerifyBalanceAccountMutation} = walletApiService;