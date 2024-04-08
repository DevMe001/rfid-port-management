import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PURGE } from "redux-persist";
import { PersonalInformation } from "../../../api-query/types";


interface Passenger extends Partial<VehiclePassenger> {
	firstname: string;
	lastname: string;
	age: number;
	gender: string;
	birthdate?: Date | string;
	seatNumber: string;
	seatPosition: string;
	fare_type: 'student' | 'regular' | 'adult' | 'minor' | string;
	rangePrice?: number;
	personal_id?: PersonalInformation['personal_id'];
	vehicleChosen?: VehiclePassenger;
	vehicletype_id?: string;
}

export interface VehiclePassenger {
	owner_name: string;
	plate_number: string;
	vehicletype_id: string;
}




export type PassegerForms = {
	isSubmitted: boolean;
	seniorPassenger: Passenger[];
	pwdPassenger: Passenger[];
	studentPassengers: Passenger[];
	childPassengers: Passenger[];
	regularPassengers: Passenger[];
	infantPassengers: Passenger[];
};



const initialState: PassegerForms = {
  isSubmitted:false,
  seniorPassenger: [],
  pwdPassenger:[],
  studentPassengers: [],
  childPassengers: [],
  regularPassengers: [],
  infantPassengers: []
};



const passengerFormSlice = createSlice({
  name:'pasengerr-form',
  initialState,
  reducers:{
    storePassengerForm : (_state,action:PayloadAction<PassegerForms>) =>{
        return action.payload;
    },
		 resetPassengerForm : () =>{
        return initialState;
    }
  },
	 extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState; // Reset the slice state to its initial state
    });
  },
});


export const { storePassengerForm, resetPassengerForm } = passengerFormSlice.actions;


export default passengerFormSlice.reducer;