import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MessageDisplay } from '../../../api-query/types';
import { PURGE } from "redux-persist";



const initialState: MessageDisplay[] = [
	{
		role: '',
		message: '',
		status: '',
		createdAt: '',
		sender: {
			displayName: 'Test',
		},
		receiver: {
			displayName: 'Test',
		},
	},
];

export const userMessageBubleSlice = createSlice({
	name: 'message-display',
	initialState,
	reducers: {
		storeUserMessage: (_state, action: PayloadAction<MessageDisplay[]>) => {
			return action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(PURGE, () => {
			return initialState;
		});
	},
});

export const { storeUserMessage } = userMessageBubleSlice.actions;

export default userMessageBubleSlice.reducer;