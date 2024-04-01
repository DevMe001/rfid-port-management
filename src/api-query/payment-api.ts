import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { PaymentOrder, PaymentProcess } from "./types";

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
	}),
});

export const {usePayOrderMutation,usePaymentProcessMutation} = paymentService;