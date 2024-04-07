import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";
import { Chat, MessageDisplay, MessageNotification, NewMessage, UnreadMessage, UserMessageBubles } from './types';






export const chatService = createApi({
	reducerPath: 'chat',
	tagTypes: ['Chat'],
	baseQuery: fetchBaseQuery({
		baseUrl: Immutable.API,
	}),
	endpoints: (builder) => ({
		getChatMessage: builder.mutation<Chat, { answer: string }>({
			query: ({ answer }) => ({
				url: `/bot?msg=${answer}`,
				method: 'GET',
			}),
			invalidatesTags: ['Chat'],
		}),
		getReceiveMessage: builder.query<MessageNotification, string>({
			query: (receiveID) => `messsage/receive/${receiveID}`,
			providesTags: ['Chat'],
			keepUnusedDataFor: 0,
		}),

		getUnreadCount: builder.query<number, string>({
			query: (sender_id) => `messsage/unread/${sender_id}`,
			providesTags: ['Chat'],
			keepUnusedDataFor: 0,
		}),
		createMessage: builder.mutation<NewMessage, NewMessage>({
			query: (body) => ({
				url: `/message/new`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Chat'],
		}),

		updateMessageStatus: builder.mutation<MessageDisplay[], UnreadMessage>({
			query: (body) => ({
				url: `/message/modify`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['Chat'],
			transformResponse: (response: { data: { data: MessageDisplay[] } }) => {
				// Check if response contains data.data
				if (response && response.data && Array.isArray(response.data.data)) {
					// Return the response.data as it is
					return response.data.data;
				} else {
					// Return empty array if response does not match expected structure
					return [];
				}
			},
		}),
	}),
});


export const {useGetChatMessageMutation,useGetReceiveMessageQuery,useGetUnreadCountQuery,useCreateMessageMutation,useUpdateMessageStatusMutation} = chatService;















