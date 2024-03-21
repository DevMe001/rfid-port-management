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
	vehicle_id:string;
	vehicletype_name:string;
	carrier_fee:number;
}


export type { BookingSchedules, VehicleType };