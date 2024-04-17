import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Immutable from '../immutable/constant';



export interface PaymentHistory {
	payment_id?: string;
	wallet_balance: string;
	booking_amount: string;
	current_balance: string;
}

export interface PaymentTransactionType {
	transaction_id: string;
	book_id: string;
	personal_id: string;
	wallet_id: string;
	payment_id?: string;
}

export type TransctionCount = {
	wallet?: number;
	schedule?: number;
	booking?: number;
	payment?: number;
	passengers?: number;
	rfid?: number;
	vehicle?: number;
	account?: number;
	user?: number;
};


export type QueryResultTypeTransactionCount = {
	data: Partial<TransctionCount>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};



export type QueryResultTypeTransaction = {
	data: Partial<PaymentTransactionType>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};



export type QueryResultTypeHistory = {
	data: Partial<PaymentHistory>;
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

type PostParams = {
	account_number:string;
}

interface Sales {
	createdAt: string;
	booking_amount: number;
}

export interface TransactionWithTotalsSales {
	today: Sales[];
	week: Sales[];
	month: Sales[];
	year: Sales[];
}
export type TransactionSalesReturn = {
	data: Partial<TransactionWithTotalsSales>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};

export const transactionService = createApi({
	reducerPath: 'transactions',
	tagTypes: ['TRANSACTION'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getPaymentHistory: builder.query<QueryResultTypeHistory, QueryOptionsWithPolling | undefined>({
			query: () => '/transaction',
			providesTags: ['TRANSACTION'],
			keepUnusedDataFor: 0,
		}),
		getTransactionList: builder.query<QueryResultTypeTransaction, QueryOptionsWithPolling | undefined>({
			query: () => '/transaction-list',
			providesTags: ['TRANSACTION'],
			keepUnusedDataFor: 0,
		}),
		getTotalSales: builder.query<TransactionSalesReturn, QueryOptionsWithPolling | undefined>({
			query: () => '/transaction/total-sale',
			providesTags: ['TRANSACTION'],
			keepUnusedDataFor: 0,
		}),

		getTransactionCountAll: builder.query<QueryResultTypeTransactionCount, QueryOptionsWithPolling | undefined>({
			query: () => '/transaction/count-all',
			providesTags: ['TRANSACTION'],
			keepUnusedDataFor: 0,
		}),
		deleteTransaction: builder.mutation<QueryResultTypeHistory, string>({
			query: (deleteID) => ({
				url: `/payment-history/${deleteID}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['TRANSACTION'],
		}),
		postTransaction: builder.mutation<QueryResultTypeHistory, PostParams>({
			query: (body) => ({
				url: `/transaction`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['TRANSACTION'],
		}),
	}),
});

export const { useGetPaymentHistoryQuery,useDeleteTransactionMutation,useGetTransactionListQuery,usePostTransactionMutation,useGetTransactionCountAllQuery,useGetTotalSalesQuery } = transactionService;


