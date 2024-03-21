import  React,{ useState } from 'react';
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

interface Passenger {
	firstName: string;
	lastName: string;
	age: string;
	gender: string;
	bdate: string;
	seat: string;
	seatNumber:string,
	fare_type: string;
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
});

const formSchema = Yup.object().shape({
	adults: Yup.number(),
	students: Yup.number(),
	minors: Yup.number(),
	adultPassengers: Yup.array().of(passengerSchema),
	studentPassengers: Yup.array().of(passengerSchema),
	minorPassengers: Yup.array().of(passengerSchema),
	regularPassengers: Yup.array().of(passengerSchema),
});





const BookingById:React.FC = () => {
	const [toggle] = onToggleNavHomepageMobile();
	const passenger = useAppSelector((state) => state.countPassenger);
	// const [displayError, setDisplayError] = useState<string>('');
	const [seatChosen, selectedSeat] = useState<string>('');
	const [seatCall, seatTagLine] = useState<number>(0);
	const [selectedId, setSelectedId] = useState<string>('');
	const [seatSelectedNumber, setSelectedSeatNumber] = useState<string>('');
	const [getDisplayPassenger,setDisplayValue] = useState<any>({});

		const [getSeat, reserveSeat] = onToggleBookingModal();

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


	const onSeatAssigned = (seatNumber: string, seat: number, formikProps: FormikProps<Passenger>) => {

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

		seatTagLine(data);

		reserveSeat(false);

		document.body.style.overflow = '';

		formikProps.setFieldValue(selectedId, seatNumber);
		formikProps.setFieldValue(seatSelectedNumber, seatNumber);
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

	return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 min-h-[40vh] h-auto'>
				<Stepper />
				<Formik
					initialValues={{
						adults: passenger.adult,
						students: passenger.student,
						minors: passenger.minor,
						regulars: passenger.regular,
						adultPassengers: Array.from({ length: passenger.adult }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							bdate: '',
							fare_type: 'adult',
							seat: 0,
							seatNumber: 0,
						})),
						studentPassengers: Array.from({ length: passenger.student }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							bdate: '',
							fare_type: 'student',
							seat: 0,
							seatNumber: 0,
						})),
						minorPassengers: Array.from({ length: passenger.minor }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							bdate: '',
							fare_type: 'minor',
							seat: 0,
							seatNumber: 0,
						})),
						regularPassengers: Array.from({ length: passenger.regular }, () => ({
							firstName: '',
							lastName: '',
							age: 0,
							gender: '',
							bdate: '',
							fare_type: 'regular',
							seat: 0,
							seatNumber: 0,
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

							{[...Array(formikProps.values.adults)].map((_, index) => (
								<div key={`adults-${index}`} className='flex flex-col gap-5 border border-1 borderLite w-8/12 mx-auto p-10 rounded my-5'>
									<h2 className='text-center text-navy font-medium'>Adult {passenger.adult > 1 ? index + 1 : ''}</h2>
									<label htmlFor={`adultPassengers.${index}.firstName`} className='font-medium text-navy'>
										First name
									</label>
									<Field id={`adults.${index}.firstName`} name={`adultPassengers.${index}.firstName`} placeholder="Adult's First Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`adultPassengers.${index}.firstName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`adultPassengers.${index}.lastName`} className='font-medium text-navy'>
										Last name
									</label>
									<Field id={`adultPassengers.${index}.lastName`} name={`adultPassengers.${index}.lastName`} placeholder="Adult's Last Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`adultPassengers.${index}.lastName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`adults.${index}.age`} className='font-medium text-navy'>
										Age
									</label>
									<Field id={`adults.${index}.age`} name={`adultPassengers.${index}.age`} placeholder="Adult's Age" type='number' className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`adultPassengers.${index}.age`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`adults.${index}.gender`} className='font-medium text-navy'>
										Gender
									</label>
									<Field id={`adults.${index}.gender`} as='select' name={`adultPassengers.${index}.gender`}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</Field>
									<ErrorMessage
										name={`adultPassengers.${index}.gender`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`adults.${index}.bdate`} className='font-medium text-navy'>
										Birthdate
									</label>
									<Field id={`adult.${index}.bdate`} name={`adult.${index}.bdate`} placeholder='Birthdate' type='date' />
									<ErrorMessage
										name={`adult.${index}.bdate`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<Field type='hidden' id={`adult.${index}.seat`} name={`adultPassengers.${index}.seat`} />
									<Field type='hidden' id={`adult.${index}.fare_type`} name={`adultPassengers.${index}.fare_type`} value='adult' />
									<Field type='hidden' id={`adult.${index}.seatNumber`} name={`studentPassengers.${index}.seatNumber`} />

									<div className='w-full h-[2.5rem] borderGray text-navy font-[500] text-center py-2 cursor-pointer hover:bg-accent hover:text-white' onClick={() => onSeatReserve('adultPassengers', index)}>
										Choose seat
									</div>
								</div>
							))}

							{[...Array(formikProps.values.students)].map((_, index) => (
								<div key={`students-${index}`} className='flex flex-col gap-5 border border-1 borderLite w-8/12 mx-auto p-10 rounded my-5'>
									<h2 className='text-center text-navy font-medium'>Student {passenger.student > 1 ? index + 1 : ''}</h2>
									<label htmlFor={`students.${index}.firstName`} className='font-medium text-navy'>
										First name
									</label>
									<Field id={`students.${index}.firstName`} name={`studentPassengers.${index}.firstName`} placeholder="Student's First Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`studentPassengers.${index}.firstName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`students.${index}.lastName`} className='font-medium text-navy'>
										Last name
									</label>
									<Field id={`students.${index}.lastName`} name={`studentPassengers.${index}.lastName`} placeholder="Student's Last Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`studentPassengers.${index}.lastName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`students.${index}.age`} className='font-medium text-navy'>
										Age
									</label>
									<Field id={`students.${index}.age`} name={`studentPassengers.${index}.age`} placeholder="Student's Age" type='number' className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`studentPassengers.${index}.age`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`students.${index}.gender`} className='font-medium text-navy'>
										Gender
									</label>
									<Field as='select' id={`students.${index}.gender`} name={`studentPassengers.${index}.gender`}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</Field>
									<ErrorMessage
										name={`studentPassengers.${index}.gender`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`students.${index}.bdate`} className='font-medium text-navy'>
										Birthdate
									</label>
									<Field id={`students.${index}.bdate`} name={`studentPassengers.${index}.bdate`} placeholder='Birthdate' type='date' />
									<ErrorMessage
										name={`studentPassengers.${index}.bdate`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>

									<Field type='hidden' id={`student.${index}.seat`} name={`studentPassengers.${index}.seat`} />
									<Field type='hidden' id={`student.${index}.fare_type`} name={`studentPassengers.${index}.fare_type`} value='student' />
									<Field type='hidden' id={`student.${index}.seatNumber`} name={`studentPassengers.${index}.seatNumber`} />

									<div className='w-full h-[2.5rem] borderGray text-navy font-[500] text-center py-2 cursor-pointer hover:bg-accent hover:text-white' onClick={() => onSeatReserve('studentPassengers', index)}>
										Choose seat
									</div>
								</div>
							))}

							{[...Array(formikProps.values.minors)].map((_, index) => (
								<div key={`minor-${index}`} className='flex flex-col gap-5 border border-1 borderLite w-8/12 mx-auto p-10 rounded my-5'>
									<h2 className='text-center text-navy font-medium'>Minor {passenger.minor > 1 ? index + 1 : ''}</h2>
									<label htmlFor={`minor.${index}.firstName`} className='font-medium text-navy'>
										First name
									</label>
									<Field id={`minor.${index}.firstName`} name={`minorPassengers.${index}.firstName`} placeholder="Student's First Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`minorPassengers.${index}.firstName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`minor.${index}.lastName`} className='font-medium text-navy'>
										Last name
									</label>
									<Field id={`minor.${index}.lastName`} name={`minorPassengers.${index}.lastName`} placeholder="Student's Last Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`minorPassengers.${index}.lastName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`minor.${index}.age`} className='font-medium text-navy'>
										Age
									</label>
									<Field id={`minor.${index}.age`} name={`minorPassengers.${index}.age`} placeholder="Student's Age" type='number' className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`minorPassengers.${index}.age`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`minor.${index}.gender`} className='font-medium text-navy'>
										Gender
									</label>
									<Field as='select' id={`minor.${index}.gender`} name={`minorPassengers.${index}.gender`}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</Field>
									<ErrorMessage
										name={`minorPassengers.${index}.gender`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`minor.${index}.bdate`} className='font-medium text-navy'>
										Birthdate
									</label>
									<Field id={`minor.${index}.bdate`} name={`minorPassengers.${index}.bdate`} placeholder='Birthdate' type='date' />
									<ErrorMessage
										name={`minorPassengers.${index}.bdate`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<Field type='hidden' id={`minor.${index}.seat`} name={`minorPassengers.${index}.seat`} />
									<Field type='hidden' id={`minor.${index}.fare_type`} name={`minorPassengers.${index}.fare_type`} value='minor' />
									<Field type='hidden' id={`minor.${index}.seatNumber`} name={`minorPassengers.${index}.seatNumber`} />

									<div className='w-full h-[2.5rem] borderGray text-navy font-[500] text-center py-2 cursor-pointer hover:bg-accent hover:text-white' onClick={() => onSeatReserve('minorPassengers', index)}>
										Choose seat
									</div>
								</div>
							))}

							{[...Array(formikProps.values.regulars)].map((_, index) => (
								<div key={`regulars-${index}`} className='flex flex-col gap-5 border border-1 borderLite w-8/12 mx-auto p-10 rounded my-5'>
									<h2 className='text-center text-navy font-medium'>Regular {passenger.regular > 1 ? index + 1 : ''}</h2>
									<label htmlFor={`regulars.${index}.firstName`} className='font-medium text-navy'>
										First name
									</label>
									<Field id={`regulars.${index}.firstName`} name={`regularPassengers.${index}.firstName`} placeholder="Student's First Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`regularPassengers.${index}.firstName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`regulars.${index}.lastName`} className='font-medium text-navy'>
										Last name
									</label>
									<Field id={`regulars.${index}.lastName`} name={`regularPassengers.${index}.lastName`} placeholder="Student's Last Name" className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`regularPassengers.${index}.lastName`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`regulars.${index}.age`} className='font-medium text-navy'>
										Age
									</label>
									<Field id={`regulars.${index}.age`} name={`regularPassengers.${index}.age`} placeholder="Student's Age" type='number' className='borderGray h-[2.5rem] w-full rounded placeholder:pl-2' />
									<ErrorMessage
										name={`regularPassengers.${index}.age`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`regulars.${index}.gender`} className='font-medium text-navy'>
										Gender
									</label>
									<Field as='select' id={`regulars.${index}.gender`} name={`regularPassengers.${index}.gender`}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</Field>
									<ErrorMessage
										name={`regularPassengers.${index}.gender`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>
									<label htmlFor={`regulars.${index}.bdate`} className='font-medium text-navy'>
										Birthdate
									</label>
									<Field id={`regulars.${index}.bdate`} name={`regularPassengers.${index}.bdate`} placeholder='Birthdate' type='date' />
									<ErrorMessage
										name={`regularPassengers.${index}.bdate`}
										render={(msg) => (
											<div style={{ color: '#f10000' }} className='error'>
												{msg}
											</div>
										)}
									/>

									<Field type='hidden' id={`regulars.${index}.seat`} name={`regularPassengers.${index}.seat`} />
									<Field type='hidden' id={`regulars.${index}.fare_type`} name={`regularPassengers.${index}.fare_type`} value='regular' />
									<Field type='hidden' id={`regulars.${index}.seatNumber`} name={`regularPassengers.${index}.seatNumber`} />

									<div className='w-full h-[2.5rem] borderGray text-navy font-[500] text-center py-2 cursor-pointer hover:bg-accent hover:text-white' onClick={() => onSeatReserve('regularPassengers', index)}>
										Choose seat
									</div>
								</div>
							))}

							<div className='flex justify-center items-center w-full'>
								<button className='btn bg-accent text-white' type='submit'>
									Submit
								</button>
							</div>

							<RenderIf value={!isEmpty(getDisplayPassenger)}>
								<div className='w-full my-5 text-center flex justify-center'>{JSON.stringify(getDisplayPassenger)}</div>
							</RenderIf>

							<RenderIf value={getSeat}>
								<PopupModal>
									<h2 className='font-medium text-navy text-center my-5'>{isEmpty(seatCall) ? 'Reserve your seat now' : `Seat # ${seatCall}`}</h2>
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
