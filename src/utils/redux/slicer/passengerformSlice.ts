import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { formSchema } from "../../../modules/buyers/addbooking/bookingById"
import passengerSlice from "./passengerSlice";



interface Passenger {
	firstName: string;
	lastName: string;
	age: number;
	gender: string;
	bdate?: string;
	seat: string;
	seatNumber: number;
	fare_type: string;
	vehicleChosen?: VehiclePassenger;
	rangePrice?:number;
}

interface VehiclePassenger {
	owner_name: string;
	plate_number: string;
	vehicle_id: string;
}




type PassegerForms = {
   isSubmitted:boolean,
    seniorPwdPassenger: Passenger[];
    studentPassengers: Passenger[];
    childPassengers: Passenger[];
    regularPassengers: Passenger[];
    infantPassengers: Passenger[];
}



const initialState: PassegerForms = {
  isSubmitted:false,
  seniorPwdPassenger: [],
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
    }
  }
});


export const { storePassengerForm } = passengerFormSlice.actions;


export default passengerFormSlice.reducer;