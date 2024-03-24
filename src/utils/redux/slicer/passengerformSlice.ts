import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { formSchema } from "../../../modules/buyers/addbooking/bookingById"



interface Passenger {
	firstName: string;
	lastName: string;
	age: string;
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
 	seniorPwdPassenger:  Partial<Passenger[]>
	studentPassengers:  Partial<Passenger[]>
	childPassengers:  Partial<Passenger[]>
	regularPassengers: Partial<Passenger[]>
	infantPassengers: Partial<Passenger[]>
}


const initialState: PassegerForms = {
  seniorPwdPassenger: [],
  studentPassengers: [],
  childPassengers: [],
  regularPassengers: [],
  infantPassengers: []
};



const pssengerFormSlicer = createSlice({
  name:'pasengerr-form',
  initialState,
  reducers:{
    storePassengerForm : (_state,action:PayloadAction<PassegerForms>) =>{
     return action.payload;
    }
  }
});



export default pssengerFormSlicer.reducer;