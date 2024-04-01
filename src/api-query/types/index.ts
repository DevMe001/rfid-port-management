import { IUser } from "../../utils/redux/slicer/authSlice";
import { VehiclePassenger } from "../../utils/redux/slicer/passengerformSlice";

type BookingSchedules = {
	schedule_id?: string;
	origin: string;
	destination: string;
	arrival_date: string;
	arrival_time: string;
	seatRange: number;
	vehicle: Vehicle;
};

type Vehicle = {
	vehicle_id?: string;
	vehicle_name: string;
	vehicle_type: string;
	vehicle_photo: string;
	vehicle_price: number;
};



 type VehicleType={
	vehicletype_id:string;
	vehicletype_name:string;
	carrier_fee:number;
}


interface PersonalInformation {
	personal_id?: string;
	firstname: string;
	midlename: string;
	lastname: string;
	age: number;
	birthdate: string;
	gender: string;
	nationality: string;
	address: string;
	mobileNumber: string;
	account_id: string;
	postal_code: number;
}

interface UploadFile {
	user_id: IUser['id'];
	profile_photo: File;
}

interface Account {
	account_id?: string;
	user_id: string;
	displayName: string;
	email: string;
	photo: string;
}


interface Address {
	city: string;
	state: string;
	postal_code: string;
	country: 'PH' | string;
}

interface Billing {
	name: string;
	email: string;
	mobile: string;
	description: string;
	productName: string;
}

interface PaymentOrder extends Billing {
	amount: number;
	paymentType?: string[];
	address: Address;
	booking_id: string;
}


type Wallet = {
	balance: number;
	is_taken: number;
	status: 'pending' | 'approved' | 'rejectected';
	personal_id: string;
};


interface Passenger extends Partial<VehiclePassenger> {
	passenger_id?: string;
	firstname: string;
	lastname: string;
	age: number;
	gender: string;
	birthdate?: Date | string;
	fare_type: 'student' | 'regular' | 'adult' | 'minor' | string;
	seatNumber: string;
	seatPosition: string;
	personal_id?: PersonalInformation['personal_id'];
	vehicletype_id?: string;
	vehicleChosen?: VehiclePassenger;
};




export interface Booking {
	book_id?: string;
	seat_numbers: string;
	amount: number;
	service_charge: number;
	schedule_id: string;
	vehicle_id?: string;
	wallet_id: string;
	status: Status;
}


type Status = 'pending' | 'approved' | 'rejected' | string;



interface PaymentProcess {
	personal_id: PersonalInformation['personal_id'];
	passengers: Omit<Passenger[], 'vehicleChosen'>;
	ewallet: Wallet;
	booking: Omit<Booking, 'wallet_id'>;
};





export type { BookingSchedules, VehicleType, PersonalInformation, UploadFile, Account, PaymentOrder, PaymentProcess };