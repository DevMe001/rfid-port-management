import { FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { PaymentOrder, PaymentProcess, PaymentWalletProcess } from "./types";
import { SerializedError } from "@reduxjs/toolkit";


type PaymentData = {
	data: PaymentWalletProcess;
};

// Define the type for error handling
type ErrorData = {
	error: FetchBaseQueryError | SerializedError;
};

// Now you can use a union type to represent either the payment data or an error
export type PaymentResult = PaymentData | ErrorData;


export const paymentService = createApi({
	reducerPath: 'payment-api',
	tagTypes: ['PAYMENT'],
	baseQuery: fetchBaseQuery({ baseUrl: Immutable.API }),
	endpoints: (builder) => ({
		payOrder: builder.mutation<PaymentOrder, PaymentOrder>({
			query: (body) => ({
				url: '/payment-request',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PAYMENT'],
		}),

		paymentProcess: builder.mutation<PaymentProcess, PaymentProcess>({
			query: (body) => ({
				url: '/payment-process',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PAYMENT'],
		}),
		paymentEwalletProcess: builder.mutation<PaymentResult, Partial<PaymentWalletProcess>>({
			query: (body) => ({
				url: '/payment/wallet-process',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['PAYMENT'],
		}),
	}),
});

export const {usePayOrderMutation,usePaymentProcessMutation,usePaymentEwalletProcessMutation} = paymentService;