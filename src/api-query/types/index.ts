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
	postal_code: number | string;
}

interface UploadFile {
	user_id: IUser['id'];
	profile_photo: File;
}

export interface Account {
	account_id?: string;
	user_id: string;
	displayName: string;
	email: string;
	photo: string;
	role?:number;
}

interface AccountDetails{
	data:Account
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
	personal_id:string;
}


type Wallet = {
	balance: number;
	is_taken: number;
	status: 'pending' | 'approved' | 'rejectected';
	personal_id: string;
};


export interface Passenger extends Partial<VehiclePassenger> {
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
	booking_amount?:string;
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
	passengers?:string
}



type Status = 'pending' | 'approved' | 'rejected' | string;



interface PaymentProcess {
	personal_id: PersonalInformation['personal_id'];
	passengers: Omit<Passenger[], 'vehicleChosen'>;
	ewallet: Wallet;
	booking: Omit<Booking, 'wallet_id'>;
};




interface Chat{
	answer:string;
}


interface Notification {
	message: string;
	sender_id: string;
	receive_id: string;
	createdAt: string;
	senderDisplayName: string;
	status: string;
}

interface MessageNotification {
	data: Notification[];
}


interface NewMessage {
	sender_id: string;
	receive_id: string;
	status?: string;
	message: string;
	type: string;
}


interface UnreadMessage{
	sender_id:string;
	receive_id:string;
}

interface ReadMessage {
	message: string;
	data:number
}


 interface UserMessageBubles {
	data: MessageDisplay[];
}

export interface MessageDisplay {
	role: string;
	message: string;
	status: string;
	createdAt: string;
	sender?: Sender;
	receiver?: Receiver;
};

export interface Sender {
  account_id?: string
  displayName?: string
}

export interface Receiver {
  account_id?: string
  displayName?: string
}

export interface RFIDSlotDto {
	rfid_id?: string;
	rfid_number: string;
}


export interface Vehicles {
	vehicle_id: string;
	vehicle_name: string;
	vehicle_type:string;
	vehicle_photo: string;
	vehicle_price: string;
}


export interface Ewallet {
	wallet_id: string;
	account_number: string;
	balance: string;
	code:string;
	personal_id: string;
};


export interface EwalletPersonalInformation {
	wallet_id: string;
	account_number: string;
	balance: string;
	code: string;
	personal_information: PersonalInformation & { createdAt: string };
};


export interface Schedules {
	schedule_id: string;
	origin: string;
	destination: string;
	arrival_date: string;
	arrival_time:string;
	vehicle_id: string;
	vehicle: Partial<Vehicles>;
}



interface PaymentWalletProcess{
	wallet_id: string;
	balance: Wallet['balance'];
	passengers: Omit<Passenger[], 'vehicleChosen'>;
	booking: Omit<Booking, 'wallet_id'>;
	message?:string;
	
}





export type { PaymentWalletProcess, BookingSchedules, VehicleType, PersonalInformation, UploadFile, AccountDetails, Account, PaymentOrder, PaymentProcess, Chat, MessageNotification, NewMessage, UnreadMessage, ReadMessage, UserMessageBubles };