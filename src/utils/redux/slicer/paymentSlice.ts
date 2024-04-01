import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

interface Payment{
  amount:number;
	schedule_id:string;
	vehicle_id:string;
}


const initialState:Payment = {
  amount:0,
	schedule_id:'',
	vehicle_id:''
}


export const paymentSlice = createSlice({
	name: 'payment-process',
	initialState,
	reducers: {
		storePayment: (_state, action: PayloadAction<Payment>) => {
			return action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(PURGE, () => {
			return initialState; // Reset the slice state to its initial state
		});
	},
});

export const { storePayment} = paymentSlice.actions;


export default paymentSlice.reducer;