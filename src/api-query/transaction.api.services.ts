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
	data: Partial<PaymentTransactionType[]> | Partial<TransactionPaymentRecord[]>;
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

type TransactionDate={
	startDate:string;
	endDate:string;
}

interface Sales {
	createdAt: string;
	booking_amount: number;
	passenger_id:string;
}

export interface TransactionWithTotalsSales {
	day: Sales[];
	week: Sales[];
	monthly: Sales[];
	year: Sales[];
}
export type TransactionSalesReturn = {
	data: Partial<TransactionWithTotalsSales>;
	error: string | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
};


export type TransactionPaymentRecord = {
	transaction_id: string;
	book_id: string;
	createdAt: string;
	booking: {
		passengers: string;
		amount: string;
		service_charge: string;
		status: string;
		schedule: {
			origin: string;
			destination: string;
			arrival_date: string;
			arrival_time: string;
			vehicle: {
				vehicle_name: string;
				vehicle_type: string;
			};
		};
	};
	wallet: {
		account_number: string;
		balance: number;
	};
	personal_information: {
		firstname: string;
		midlename: string;
		lastname: string;
		mobileNumber: string;
		address: string;
		postal_code: string;
	};
	payment_history: {
		wallet_balance: number;
		payment_type: string;
		booking_amount: number;
		current_balance: number;
		createdAt: string;
		passenger_id:number;
	};
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

		getTransactionById: builder.query<TransactionPaymentRecord, QueryOptionsWithPolling | string>({
			query: (id) => `/transaction/${id}`,
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

		filterTransactionListByDate: builder.mutation<QueryResultTypeTransaction, TransactionDate>({
			query: ({ startDate, endDate }) => ({
				url: `/transaction/findDate?startDate=${startDate}&endDate=${endDate}`,
				method: 'GET',
				providesTags: ['TRANSACTION'],
				keepUnusedDataFor: 0,
			}),
			invalidatesTags: ['TRANSACTION'],
		}),
	}),
});

export const { useFilterTransactionListByDateMutation, useGetTransactionByIdQuery, useGetPaymentHistoryQuery, useDeleteTransactionMutation, useGetTransactionListQuery, usePostTransactionMutation, useGetTransactionCountAllQuery, useGetTotalSalesQuery } = transactionService;


