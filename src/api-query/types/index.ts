import { IUser } from "../../utils/redux/slicer/authSlice";

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


export type { BookingSchedules, VehicleType, PersonalInformation, UploadFile, Account };