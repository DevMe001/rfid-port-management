import  React,{ useEffect, useState } from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import Stepper from '../../../common/widget/stepper';
import { onToggleBookingModal, onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import { Formik, Field, Form, ErrorMessage, FormikProps } from 'formik';
import { useAppSelector } from '../../../utils/redux/store';

import * as Yup from 'yup';
import { isEmpty } from 'lodash';

import '../styles/book-list.css'
import PopupModal from '../../../common/widget/modal/popup.,modal';
import { MdEventSeat } from 'react-icons/md';

import { FaRestroom } from 'react-icons/fa';
import clsx from 'clsx';
import waitSec from '../../../utils/setTimeout';

import CustomButton from '../../../common/components/ui/button.componetnt';

import PassengerFormDetails from './components/passenger-form.component';

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




const passengerSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	age: Yup.string(),
	gender: Yup.string().required('Gender is required'),
	bdate: Yup.string(),
	seat: Yup.string(),
	seatNumber: Yup.string(),
	fare_type: Yup.string(),
	vehicleChosen: Yup.object(),
});


const formSchema = Yup.object().shape({
	seniorPwd: Yup.number(),
	students: Yup.number(),
	regulars: Yup.number(),
	child: Yup.number(),
	infant: Yup.number(),
	seniorPwdPassenger: Yup.array().of(passengerSchema),
	studentPassengers: Yup.array().of(passengerSchema),
	childPassengers: Yup.array().of(passengerSchema),
	regularPassengers: Yup.array().of(passengerSchema),
	infantPassengers:Yup.array().of(passengerSchema),
});





const BookingById:React.FC = () => {


	const [toggle] = onToggleNavHomepageMobile();
	const passenger = useAppSelector((state) => state.countPassenger);
	// const [displayError, setDisplayError] = useState<string>('');
	const [seatChosen, selectedSeat] = useState<string>('');
	const [seatCall, seatTagLine] = useState<number>(0);
	// const [seatArrNumber, setSeatNumberArr] = useState<number[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');
	const [seatSelectedNumber, setSelectedSeatNumber] = useState<string>('');
	const [getDisplayPassenger,setDisplayValue] = useState<any>({});
	const [passengerVehicle,setPassengerVehicle] = useState<boolean>(false);

		const [getSeat, reserveSeat] = onToggleBookingModal();


		useEffect(() => {
			if (!getSeat) {
				document.body.style.overflow = '';
			}
		}, [getSeat]);

	const onSeatReserve = (type: string, index: number) => {
		reserveSeat(!getSeat);
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setSelectedId(`${type}.${index}.seat`);
		setSelectedSeatNumber(`${type}.${index}.seatNumber`);
	};


	const onPassengerVehicle = (type: string,fieldType:string, index: number, formikProps: FormikProps<any>) => {
		setPassengerVehicle(!passengerVehicle);

		if(type == 'remove'){
				formikProps.setFieldValue(`${fieldType}.${index}.vehicleChosen.vehicle_id`,'');
				formikProps.setFieldValue(`${fieldType}.${index}.vehicleChosen.owner_name`,'');
				formikProps.setFieldValue(`${fieldType}.${index}.vehicleChosen.plate_number`,'');
		}

	
	};

	const onSeatAssigned = async(seatNumber: string, seat: number, formikProps: FormikProps<Passenger>) => {

		selectedSeat(seatNumber);


		let data = seat;
		let block = [19, 29, 39, 49, 59, 69];

		if (data >= 9 && data < 18) {
			data = seat - 1;
		}
		if (block.includes(data)) {
			data = seat - 2;
		}

		if (data >= 20) {
			data = seat - 2;
		}

		if (data >= 27) {
			data = seat - 3;
		}

		if (data >= 36) {
			data = seat - 4;
		}

		if (data >= 45) {
			data = seat - 5;
		}

		if (data >= 54) {
			data = seat - 6;
		}
		if (seat >= 69 && seat <= 71) {
			data = data - 1;
		}

		if (data >= 72) {
			data = seat - 15;
		}

		if (data >= 76) {
			data = seat - 25;
		}

		if (seat >= 101) {
			data = seat - 28;
		}

		if (seat >= 111) {
			data = seat - 31;
		}
		if (seat >= 121) {
			data = seat - 34;
		}

		if (seat >= 131) {
			data = seat - 37;
		}

		// setSeatNumberArr((current) => [...current, data]);
		seatTagLine(data);
		await waitSec(1500);

		reserveSeat(!getSeat);

		document.body.style.overflow = '';

		formikProps.setFieldValue(selectedId, seatNumber);
		formikProps.setFieldValue(seatSelectedNumber, data);
	};

const renderSeats = (formikProps: FormikProps<Passenger>) => {
	let rows = [];

	let numRows = 14;
	let numColumns = 10;

	// let seatsAlreadyTaken = ['1-1', '2-3', '5-3', '6-4', '7-5', '3-6','10-5','7-9'];

	let seatsAlreadyTaken: string[] = [];

	for (let row = 1; row <= numRows; row++) {
		let columns = [];

		for (let col = 1; col <= numColumns; col++) {
			if ((row <= 7 && col <= 7) || (row <= 8 && col > 8) || (row > 9 && col <= 7)) {
				let seatKey: string = `${row}-${col}`;

				let seatNumber = (row - 1) * numColumns + col;

				if (seatsAlreadyTaken.includes(seatKey)) {
					columns.push(
						<MdEventSeat
							key={seatKey}
							className='seatTaken text-navy cursor-not-allowed'
							style={{
								fontSize: '24px',
								background: '#eaeaea',
								opacity: '0.2',
							}}
						/>,
					);
				} else {
					columns.push(
						<MdEventSeat
							title='Already taken'
							onClick={() => onSeatAssigned(seatKey, seatNumber, formikProps)}
							key={seatKey}
							className={clsx('text-navy hover:bg-accent hover:text-white cursor-pointer', {
								'bg-accent': seatChosen == seatKey,
								'text-white': seatChosen == seatKey,
							})}
							style={{ fontSize: '24px' }}
						/>,
					);
				}
			} else if ((row > 7 && row < 9) || col <= 8 || (row == 9 && col >= 9) || (row > 11 && row <= 12 && col >= 9)) {
				columns.push(<div key={`${row}-${col}`} style={{ fontSize: '1rem', width: '24px', height: 'auto' }} className='bg-green-500' />);
			} else {
				// Empty spaces for the rest
				columns.push(<FaRestroom key={`${row}-${col}`} style={{ fontSize: '24px', border: '1px solid #032868', background: '#ffffff', color: '#D15331' }} />);
			}
		}
		rows.push(
			<div key={row} className='flex col gap-2'>
				{columns}
			</div>,
		);
	}

	return rows;
};

const onSeat = (type:string,index:number)=>{
	onSeatReserve(type, index);

}

	return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 min-h-[40vh] h-auto background-design'>
				<Stepper />
				<Formik
					initialValues={{
						seniorPwd: passenger.senior,
						students: passenger.student,
						regulars: passenger.regular,
						child: passenger.child,
						infant: passenger.infant,

						seniorPwdPassenger: Array.from({ length: passenger.senior }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							fare_type: 'senior',
							seat: 0,
							seatNumber: 0,
							rangePrice: 757,
						})),
						studentPassengers: Array.from({ length: passenger.student }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							fare_type: 'student',
							seat: 0,
							seatNumber: 0,
							rangePrice: 848,
						})),
						childPassengers: Array.from({ length: passenger.child }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							fare_type: 'child',
							seat: 0,
							seatNumber: 0,
							rangePrice: 530,
						})),
						regularPassengers: Array.from({ length: passenger.regular }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							fare_type: 'regular',
							seat: 0,
							seatNumber: 0,
							rangePrice:1060
						})),

						infantPassengers: Array.from({ length: passenger.infant }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							fare_type: 'infant',
							seat: 0,
							seatNumber: 0,
							rangePrice:60
						})),
					}}
					validationSchema={formSchema}
					onSubmit={(values, { setSubmitting }) => {
						// Handle form submission
						console.log(values);
						setDisplayValue(values);
						// Add your submission logic here
						setSubmitting(false); // Ensure to reset form submission status
					}}
				>
					{(formikProps) => (
						<Form className='my-12'>
							{/* Input fields for counts of adults, students, and minors */}
							{/* <Field name='adults' type='number' />
							<Field name='students' type='number' />
							<Field name='minors' type='number' /> */}

							{/* {!isEmpty(displayError) && <div className='text-lite font-bold py-3 px-5 bg-accent text-center'>{displayError}</div>} */}

							{[...Array(formikProps.values.seniorPwd)].map((_, index) => (
								<div key={`adults-${index}`}>
									{/* // @ts-ignore */}
									<PassengerFormDetails identifyAs={`seniorPwdPassenger.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.seniorPwdPassenger[index].seatNumber as number} onSeatChosen={() => onSeat('seniorPwdPassenger', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'seniorPwdPassenger', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'seniorPwdPassenger', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Senior/Pwd'} />
								</div>
							))}

							{[...Array(formikProps.values.students)].map((_, index) => (
								<div key={`students-${index}`}>
									{/* // @ts-ignore */}
									<PassengerFormDetails identifyAs={`studentPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.studentPassengers[index].seatNumber as number} onSeatChosen={() => onSeat('studentPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'studentPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'studentPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Student'} />
								</div>
							))}

							{[...Array(formikProps.values.regulars)].map((_, index) => (
								<div key={`regulars-${index}`}>
									{/* // @ts-ignore */}
									<PassengerFormDetails identifyAs={`regularPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.regularPassengers[index].seatNumber as number} onSeatChosen={() => onSeat('regularPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'regularPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'regularPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Regular'} />
								</div>
							))}

							{[...Array(formikProps.values.child)].map((_, index) => (
								<div key={`child-${index}`}>
									{/* // @ts-ignore */}
									<PassengerFormDetails identifyAs={`childPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.childPassengers[index].seatNumber as number} onSeatChosen={() => onSeat('childPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'childPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'childPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Child'} />
								</div>
							))}

							{[...Array(formikProps.values.infant)].map((_, index) => (
								<div key={`infant-${index}`}>
									{/* // @ts-ignore */}
									<PassengerFormDetails identifyAs={`infantPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.infantPassengers[index].seatNumber as number} onSeatChosen={() => onSeat('infantPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'infantPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'infantPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Infant'} />
								</div>
							))}

							<div className='flex justify-center items-center w-full'>
								<CustomButton label='Submit' type='submit' />
							</div>

							<RenderIf value={!isEmpty(getDisplayPassenger)}>
								<div className='w-full my-5 text-center flex justify-center'>{JSON.stringify(getDisplayPassenger)}</div>
							</RenderIf>

							<RenderIf value={getSeat}>
								<PopupModal>
									<h2 className='font-medium text-navy text-center my-5'>{isEmpty(seatChosen) ? 'Reserve your seat now' : `Seat # ${seatCall}`}</h2>
									<div style={{ display: 'flex', flexDirection: 'column' }}>{renderSeats(formikProps as any)}</div>
								</PopupModal>
							</RenderIf>
						</Form>
					)}
				</Formik>
			</main>
		</RenderIf>
	);
};

export default BookingById;
