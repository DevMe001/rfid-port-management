import React, { useCallback, useEffect, useState, useRef } from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import Stepper from '../../../common/widget/stepper';
import { onActiveMode, onToggleBookingModal, onToggleNavHomepageMobile, useGlobaLoader } from '../../../utils/hooks/globa.state';
import { Formik, Form, FormikProps } from 'formik';
import { RootState, useAppDispatch, useAppSelector } from '../../../utils/redux/store';

import * as Yup from 'yup';
import { isEmpty } from 'lodash';

import '../styles/book-list.css'
import '../styles/loader.css'
import PopupModal from '../../../common/widget/modal/popup.,modal';
import { MdEventSeat } from 'react-icons/md';

import { FaRestroom } from 'react-icons/fa';
import clsx from 'clsx';
import waitSec from '../../../utils/setTimeout';

import CustomButton from '../../../common/components/ui/button.componetnt';

import PassengerFormDetails from './components/passenger-form.component';
import { GiCargoShip } from 'react-icons/gi';
import Immutable from '../../../immutable/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBookingScheduleByIdQuery } from '../../../api-query/schedule-list.api';
import dateArrival from '../../../utils/dateFormat';
import { enqueueSnackbar } from 'notistack';
import { resetPassengerForm, storePassengerForm } from '../../../utils/redux/slicer/passengerformSlice';
import { useGetPersonalDetailsByIdQuery } from '../../../api-query/personal-details.api';
import displayFullName from '../../../utils';

import { BiRfid } from 'react-icons/bi';
import { PaymentResult, usePayOrderMutation, usePaymentEwalletProcessMutation } from '../../../api-query/payment-api';
import { PaymentOrder, PaymentWalletProcess } from '../../../api-query/types';
import LoaderSpinner from '../../../common/widget/loader';

import dayjs from 'dayjs';
import { storePayment } from '../../../utils/redux/slicer/paymentSlice';

import { useGetVerifyBalanceAccountMutation } from '../../../api-query/wallet-api';

import RFIDScannerDevice from '../../../common/components/ui/rfid-scanner';
import { useGetSeatTakenQuery } from '../../../api-query/bookingapi-service';

interface Passenger {
	firstname: string;
	lastname: string;
	age: number;
	gender: string;
	birthdate: Date | string;
	seatNumber: string;
	seatPosition: string;
	fare_type: string;
	vehicleChosen?: VehiclePassenger;
	rangePrice?: number;
	personal_id?: string;
}

interface VehiclePassenger {
	owner_name: string;
	plate_number: string;
	vehicletype_id: string;
}

const seniorAgo = dayjs().subtract(60, 'year').format('YYYY-MM-DD');
const dateNow = dayjs().format('YYYY-MM-DD');



// const passengerSchema = Yup.object().shape({
// 	firstName: Yup.string().required('First name is required'),
// 	lastName: Yup.string().required('Last name is required'),
// 	age: Yup.number().required('Age is required').min(1, 'Age is not allowed'),
// 	gender: Yup.string().required('Gender is required'),
// 	bdate: Yup.date().max(eighteen_years_ago, 'You must be at least 18 years old to register'),
// 	seat: Yup.string(),
// 	seatNumber: Yup.string(),
// 	fare_type: Yup.string(),
// 	vehicleChosen: Yup.object(),
// });

function validatorSchemaHandler(passengerType: string) {
	const schema = Yup.object().shape({
		firstname: Yup.string().required('First name is required'),
		lastname: Yup.string().required('Last name is required'),
		age: Yup.number().required('Age is required').min(60, 'Senior must be 60 yrs old and above'),
		gender: Yup.string().required('Gender is required'),
		birthdate: Yup.date().max(seniorAgo, 'You must be at least 60 years old to register'),
		seatPosition: Yup.string().required(),
		seatNumber: Yup.string(),
		fare_type: Yup.string(),
		personal_id: Yup.string(),
		vehicleChosen: Yup.object(),
	});


	  if (passengerType === 'infant') {
			return schema.shape({
				age: Yup.number().required('Age is required').min(1, 'Age is not allowed').max(3, 'Age must be 1 - 3 years old'),
				birthdate: Yup.date().test('senior-bdate', 'Age must 1 to 3 years old', function (value) {
					let dateValue = dayjs().diff(dayjs(value), 'year');

					if (dateValue >= 1 && dateValue <= 3) {
						return true;
					} else {
						return false;
					}
				}),
			});
		} 
		  if (passengerType === 'child') {
				return schema.shape({
					age: Yup.number().required('Age is required').min(4, 'Age is not allowed').max(11, 'Age must be 4 - 11 years old'),

					birthdate: Yup.date().test('child-birthdate', 'Age must 4 to 11 years old', function (value) {
						let dateValue = dayjs().diff(dayjs(value), 'year');

						if (dateValue >= 4 && dateValue <= 11) {
							return true;
						} else {
							return false;
						}
					}),
				});
			}


					  if (passengerType === 'pwd') {
							return schema.shape({
								age: Yup.number().required('Age is required').min(1, 'Age is not allowed').max(100, 'Age at least one years old'),

								birthdate: Yup.date().test('pwd-birthdate', 'Age at least one years old', function (value) {
									let dateValue = dayjs().diff(dayjs(value), 'year');

									console.log(dateValue, 'get valie');
									if (dateValue >= 1) {
										return true;
									} else {
										return false;
									}
								}),
							});
						}

					  if (passengerType === 'student') {
							return schema.shape({
								age: Yup.number().required('Age is required').min(12, 'Age is not allowed').max(22, 'Age must be 12 - 22 years old'),

								birthdate: Yup.date().test('student-birthdate', 'Age must 4 to 11 years old', function (value) {
									let dateValue = dayjs().diff(dayjs(value), 'year');

									if (dateValue >= 12 && dateValue <= 22) {
										return true;
									} else {
										return false;
									}
								}),
							});
						}
						  if (passengerType === 'regular') {
								return schema.shape({
									age: Yup.number().required('Age is required').min(23, 'Age is not allowed').max(49, 'Age must be 23 - 49 years old'),

									birthdate: Yup.date().test('regular-birthdate', 'Age must 23 to 49 years old', function (value) {
										let dateValue = dayjs().diff(dayjs(value), 'year');

										if (dateValue >= 23 && dateValue <= 49) {
											return true;
										} else {
											return false;
										}
									}),
								});
							} else {
								return schema;
							}
}


export const formSchema = Yup.object().shape({
	senior: Yup.number(),
	pwd: Yup.number(),
	students: Yup.number(),
	regulars: Yup.number(),
	child: Yup.number(),
	infant: Yup.number(),
	seniorPassenger: Yup.array().of(validatorSchemaHandler('senior')),
	pwdPassenger: Yup.array().of(validatorSchemaHandler('pwd')),
	studentPassengers: Yup.array().of(validatorSchemaHandler('student')),
	childPassengers: Yup.array().of(validatorSchemaHandler('child')),
	regularPassengers: Yup.array().of(validatorSchemaHandler('regular')),
	infantPassengers: Yup.array().of(validatorSchemaHandler('infant')),
});




const BookingById:React.FC = () => {


	const [toggle] = onToggleNavHomepageMobile();
	const passenger = useAppSelector((state:RootState) => state.countPassenger);
	// const [displayError, setDisplayError] = useState<string>('');
	const [seatChosen, selectedSeat] = useState<string>('');
	const [seatCall, seatTagLine] = useState<number>(0);

	const [selectedId, setSelectedId] = useState<string>('');
	const [seatSelectedNumber, setSelectedSeatNumber] = useState<string>('');
	const [getDisplayPassenger,setDisplayValue] = useState<any>({});
	const [passengerVehicle,setPassengerVehicle] = useState<boolean>(false);
	const [payOrder] = usePayOrderMutation();

	const [loader, setLoader] = useGlobaLoader();


	const params = useParams();



	const navigate = useNavigate();
		
	const { data: scheduledSelected } = useGetBookingScheduleByIdQuery(params.bookId as string, { pollingInterval: 5000, refetchOnMountOrArgChange: true, skip: false });

	const { data: getSeatTaken } = useGetSeatTakenQuery(undefined, { pollingInterval: 5000, refetchOnMountOrArgChange: true, skip: false });


	const [seatArrNumber, setSeatNumberArr] = useState<any[]>(getSeatTaken?.data as unknown as string[] ?? []);



useEffect(()=>{

	if (getSeatTaken && getSeatTaken.data) {
		setSeatNumberArr(getSeatTaken?.data as unknown as string[]);
	}


},[setSeatNumberArr,getSeatTaken])


		const user = useAppSelector((state: RootState) => state.authUser);

		const passengerFormList = useAppSelector((state: RootState) => state.passengerFormDetails);

	const { data: userProfileDetails } = useGetPersonalDetailsByIdQuery(user.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const getParamsSchedule = !isEmpty(scheduledSelected) ? scheduledSelected : undefined;

	const [payModal, setPayModal] = onToggleBookingModal();

	//  const navigate = useNavigate();

		const showBookDisplay = passengerFormList.isSubmitted ? 1 : 0;


		const [{ isActive }, setActive] = onActiveMode();





		const [tabValue, setCurrentTab] = useState<number>(showBookDisplay);

	const dispatch = useAppDispatch();

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
		setSelectedId(`${type}.${index}.seatPosition`);
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

	const onSeatAssigned = async(seatNumber: string, seat: number, formikProps: FormikProps<any>) => {

		let {values} = formikProps;
		let splitSelectedId = selectedId.split('.');

		let seatAlreadyTaken = false;

			values[splitSelectedId[0]].map((item: { seatPosition: string }) => {
				if (isEmpty(item.seatPosition)) {
					seatAlreadyTaken = true;
				}
			});
		
		if(seatAlreadyTaken){
			

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



		setSeatNumberArr((current) => [...current, seatNumber]);
		seatTagLine(data);
		await waitSec(1500);


		document.body.style.overflow = '';

		formikProps.setFieldValue(selectedId, seatNumber);
		formikProps.setFieldValue(seatSelectedNumber, data);
		}else{
			enqueueSnackbar('Seat already settled,Click x set to a new one', { variant: 'error', autoHideDuration: 5000 });
		}

		
		reserveSeat(!getSeat);
	};

const renderSeats = (formikProps: FormikProps<Passenger>) => {
	let rows = [];

	let numRows = 14;
	let numColumns = 10;

	// let seatsAlreadyTaken = ['1-1', '2-3', '5-3', '6-4', '7-5', '3-6','10-5','7-9'];


	let seatsAlreadyTaken: string[] = seatArrNumber;

	for (let row = 1; row <= numRows; row++) {
		let columns = [];

		for (let col = 1; col <= numColumns; col++) {
			if ((row <= 7 && col <= 7) || (row <= 8 && col > 8) || (row > 9 && col <= 7)) {
				let seatKey: string = `${row}-${col}`;

				let seatNumber = (row - 1) * numColumns + col;

				if (seatsAlreadyTaken.includes(seatKey)) {
					columns.push(
						<MdEventSeat
							title='Already taken'
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

const onSeatSelectedClear = (formikProps: FormikProps<any>) => {

	let selectedValue = selectedId.split('.');
	const { values } = formikProps;

	let seatValueInput = '';
	
	
	values[selectedValue[0]].map((item: { seatPosition: string }) => {
		seatValueInput = item.seatPosition;
	});

	const index = seatArrNumber.indexOf(seatValueInput);

	if (index !== -1) {
	seatArrNumber.splice(index, 1);

	setSeatNumberArr((current) => [...current]);
	formikProps.setFieldValue(selectedId,'');
	}

};

const onSeat = (type:string,index:number)=>{
	onSeatReserve(type, index);
}

function passegerList() {
	let passengerType = '';

	if (passenger.senior > 0) {
		passengerType += 'Senior ';
	}

		if (passenger.pwd > 0) {
		passengerType += 'Pwd ';
	}


	if (passenger.student > 0) {
		passengerType += 'Student ';
	}
	if (passenger.regular > 0) {
		passengerType += 'Regular ';
	}
	if (passenger.child > 0) {
		passengerType += 'Child ';
	}
	if (passenger.infant > 0) {
		passengerType += 'Infant';
	}

	let listPassenger = passengerType.trim().split(' ');

	if (listPassenger.length > 1) {
		passengerType = listPassenger.join(', ');
	}

	return passengerType;
}


interface VehicleRecord {
	vehicleChosen: string;
	vehicleName: string;
	carrierFee: string;
	owner: string;
	plate_number: string;
	passengerType: string;
}

function calculatePassengersVehicle() {
	const vehicles: VehicleRecord[] = [];

	function pushUniqueRecord(vehicleChosen: string, vehicleName: string, carrierFee: string, owner: string, plate_number: string, passengerType: string): void {
		const record: VehicleRecord = {
			vehicleChosen,
			vehicleName,
			carrierFee,
			owner,
			plate_number,
			passengerType,
		};

		const exists = vehicles.some((v) => JSON.stringify(v) === JSON.stringify(record));

		if (!exists) {
			vehicles.push(record);
		}
	}

	const { seniorPassenger, regularPassengers, studentPassengers } = passengerFormList;


	if (seniorPassenger && seniorPassenger.length > 0) {
		seniorPassenger.forEach((item) => {
			if (item.vehicleChosen) {

				console.log(item.vehicleChosen );

				const vehicleSplit = item.vehicleChosen?.vehicletype_id?.split(',');

				pushUniqueRecord(vehicleSplit[0], vehicleSplit[1], vehicleSplit[2], item.vehicleChosen.owner_name, item.vehicleChosen.plate_number, 'senior');
			}
		});
	}



	if (regularPassengers && regularPassengers.length > 0) {
		regularPassengers.forEach((item) => {
			if (item.vehicleChosen) {
				const vehicleSplit = item.vehicleChosen?.vehicletype_id?.split(',');
		
				pushUniqueRecord(vehicleSplit[0], vehicleSplit[1], vehicleSplit[2], item.vehicleChosen.owner_name, item.vehicleChosen.plate_number, 'regular');
			}
		});
	}

	if (studentPassengers && studentPassengers.length > 0) {
		studentPassengers.forEach((item) => {
			if (item.vehicleChosen) {
				const vehicleSplit = item.vehicleChosen?.vehicletype_id?.split(',');
				
				pushUniqueRecord(vehicleSplit[0], vehicleSplit[1], vehicleSplit[2], item.vehicleChosen.owner_name, item.vehicleChosen.plate_number, 'student');
			}
		});
	}

	let vehicleList = '';

	vehicles.map((item) =>{

		if(!isEmpty(item.vehicleName)){
				vehicleList += ` ${item.vehicleName} x  (₱ ${item.carrierFee}) `;
		}
			

	})

let totalVehicles = vehicles.reduce((acc, cur) => {

	if (cur.carrierFee) {
		return acc + Number(cur.carrierFee);
	} else {
		return acc;
	}

}, 0);



	return [vehicleList, totalVehicles];
}


function calculatePassengers(){
		let type = passenger.passengerClass;
		let senior = 0,student=0,child=0,regular=0,infant=0,pwd=0;
		let countSenior = passenger.senior;
		let countPwd = passenger.pwd;
		let countStudent = passenger.student;
		let countRegular = passenger.regular;
		let countChild = passenger.child;
		let countInfant = passenger.infant;
		let terminalFee = 10;
		let serviceFee = 10;
	

		if(type === 'economy'){
				senior = countSenior > 0 ? (757 * countSenior) + (terminalFee + serviceFee) : 0;
				pwd =  countPwd > 0 ? (757 * countPwd) + (terminalFee + serviceFee) : 0;
				student = countStudent > 0 ? ( 848 * countStudent)  + (terminalFee + serviceFee) : 0;
				regular =countRegular > 0 ?  (1060 * countRegular)  + (terminalFee + serviceFee) : 0;
				child = countChild > 0 ? (530 * countChild)  + (terminalFee + serviceFee) : 0;
				infant = countInfant > 0 ?  (60 * countInfant)  + (terminalFee + serviceFee) : 0;
				
				let discountedSenior = senior * 0.20;
				let discountedPwd = pwd * 0.20;

				senior = senior - discountedSenior;
				pwd = pwd - discountedPwd;
			
		}
		if(type === 'tourist'){
							senior = countSenior > 0 ? 757 * countSenior + (terminalFee + serviceFee) : 0;
							pwd = countPwd > 0 ? 757 * countPwd + (terminalFee + serviceFee) : 0;
							student = countStudent > 0 ? 848 * countStudent + (terminalFee + serviceFee) : 0;
							regular = countRegular > 0 ? 1060 * countRegular + (terminalFee + serviceFee) : 0;
							child = countChild > 0 ? 530 * countChild + (terminalFee + serviceFee) : 0;
							infant = countInfant > 0 ? 60 * countInfant + (terminalFee + serviceFee) : 0;

								let discountedSenior = senior * 0.2;
								let discountedPwd = pwd * 0.2;

								senior = senior - discountedSenior;
								pwd = pwd - discountedPwd;
		}

		let displayFareRate = '';




		let passengerTotalList = [
			{ label: 'senior ', count: countSenior, total: senior  },
			{ label: 'pwd ', count: countPwd, total: pwd  },
			{ label: ' student ', count: countStudent, total: student },
			{ label: ' regular', count: countRegular, total: regular },
			{ label: ' child', count: countChild, total: child },
			{ label: ' infant', count: countInfant, total: infant },
		];

		passengerTotalList.map((list) =>{
			if(list.count !== 0){

					displayFareRate += `${list.label} (${list.count} x ₱ ${list.total}) ,`;
			}
		})

	let totalPassengerAmount =	passengerTotalList.reduce((acc,cur) => acc + cur.total , 0);


	return [displayFareRate, totalPassengerAmount];

}



// payment process
const onPaymentProcess = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
	setPayModal(!payModal);
}, [payModal]);


const onPaymentProceeed = useCallback(async()=>{




				let totalAmount = Number(Number(calculatePassengers()[1]) + Number(calculatePassengersVehicle()[1])).toFixed(2);

				if (Number(totalAmount) > 0) {
					let getAddress = userProfileDetails?.address as string;
					console.log(getAddress, 'get address');

					let addressSplice = getAddress.split(' ');

					const paymentForm: PaymentOrder = {
						name: displayFullName(userProfileDetails?.firstname, userProfileDetails?.midlename, userProfileDetails?.lastname),
						email: user?.email,
						mobile: userProfileDetails?.mobileNumber as string,
						description: 'Booking id 1234',
						productName: 'Booking',
						amount: Number(totalAmount),
						address: {
							city: `${addressSplice[0]} ${addressSplice[1]}`,
							state: addressSplice[2],
							postal_code: '3202',
							country: 'PH',
						},
						booking_id: params.bookId as string,
						personal_id: userProfileDetails?.personal_id as string,
					};

					console.log(params.bookId,'get booking it')

					const paymentResponse: any = await payOrder({ ...paymentForm });

						console.log(paymentResponse);

					if (!paymentResponse.data.message.includes('Proceed')) {
						enqueueSnackbar(paymentResponse.data.message, { variant: 'error', autoHideDuration: 3000 });
					} else {
						dispatch(
							storePayment({
								amount: Number(totalAmount),
								schedule_id: getParamsSchedule?.schedule_id as string,
								vehicle_id: getParamsSchedule?.vehicle.vehicle_id as string,
								personal_id: userProfileDetails?.personal_id as string
							}),
						);

						setLoader(true);

						await waitSec(2000);

						setLoader(false);

					location.href = paymentResponse?.data.data?.attributes?.checkout_url;
					}
				}
			

		
},[])

const [scannerPaymentState,setPaymentRFIDState] = useState<boolean>(false);
const [scanner, setScanner] = useState<boolean>(false);

const [scan, setScan] = useState<string>('');
const [scannedValue, setScanValue] = useState<string>('');
const [codeInput,setCode] = useState<string>('');

const inputRFIDRef = useRef<HTMLInputElement>(null);
// use rfid features
const OnRFIDScannerShow = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
	e.stopPropagation();
	setPaymentRFIDState(true);
	setPayModal(false);
		document.body.style.overflow = 'hidden';
		
}

	const onCloseRfid = useCallback(() => {
		setPaymentRFIDState(false);
		setPayModal(false);
		document.body.style.overflow = '';
		setScan('');
	}, [setScan]);


	
	
const [getVerifyBalanceAccount] = useGetVerifyBalanceAccountMutation();


	let valueArr:string[] = [];

const handlerScanningDevice = useCallback(
	async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		valueArr.push(value);
		setScanner(true);
		await waitSec(2000);
		setScanner(false);

	

		if(!isEmpty(value)){
			
		const getFinalValue = valueArr.join('');
			
			setScanValue(getFinalValue);
			setScan(getFinalValue);
		}
		
	},
	[setScanner, setScan],
);


const handleRFIDCode = useCallback(
	async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCode(value);
	},
	[setCode],
);



// payment process for wallet 337154
	const allPassengerList = useAppSelector((state: RootState) => state.passengerFormDetails);
	const paymetntWalletFormInput = useAppSelector((state: RootState) => state.paymentProcess);

	const [paymentEwalletProcess] = usePaymentEwalletProcessMutation();

const OnRFIDWalletCheck = useCallback(
	async () => {

		console.log(scannedValue);
		console.log(userProfileDetails?.personal_id);

		const data = {
			terms:scan,
			code:codeInput,
			personal_id:userProfileDetails?.personal_id as string
		}
		const res:any = await getVerifyBalanceAccount(data);

	let totalAmount = Number(Number(calculatePassengers()[1]) + Number(calculatePassengersVehicle()[1])).toFixed(2);

		if (res.data.message === 'illegal') {
			enqueueSnackbar('Account number not linked to user', { variant: 'warning', autoHideDuration: 4000 });
		} else if (res.data.message === 'valid') {
			if (totalAmount <= res.data.balance) {
				const amountDebit = Number(res.data.balance) - Number(totalAmount);
				const passengerList = [...allPassengerList.seniorPassenger, ...allPassengerList.pwdPassenger, ...allPassengerList.studentPassengers, ...allPassengerList.childPassengers, ...allPassengerList.infantPassengers];
				const seatListItem = passengerList.map((item) => item.seatPosition).join(', ');

				const walletId: string = res.data.walletId as string;

				const paymentForms: PaymentWalletProcess = {
					wallet_id: walletId,
					balance: amountDebit,
					passengers: passengerList,
					booking: {
						seat_numbers: seatListItem,
						amount: paymetntWalletFormInput.amount,
						service_charge: 40,
						schedule_id: paymetntWalletFormInput.schedule_id,
						vehicle_id: paymetntWalletFormInput.vehicle_id ?? '0',
						status: 'pending',
					},
				};

				const paymentProcess = await paymentEwalletProcess({ ...paymentForms });

				if ('data' in paymentProcess) {
					const msg: string = (paymentProcess.data as any).message as string;

					console.log(msg,'get message');

					if (msg === 'payment success') {
						enqueueSnackbar('Transaction completed', { variant: 'success', autoHideDuration: 4000 });

						await waitSec(2000);
						onCloseRfid();
						dispatch(resetPassengerForm());
						navigate('/booking');
					} else {
						enqueueSnackbar(msg, { variant: 'warning', autoHideDuration: 4000 });
						await waitSec(2000);
						onCloseRfid();
						dispatch(resetPassengerForm());
						navigate('/booking');
					}
				} else {
					// Handle the error case
					enqueueSnackbar('Transaction failed', { variant: 'error', autoHideDuration: 4000 });
				}
			} else {
				enqueueSnackbar('Insuficient fund', { variant: 'error', autoHideDuration: 4000 });
			}
		} else {
			//337154
			enqueueSnackbar('Invalid credentials', { variant: 'error', autoHideDuration: 4000 });
		}
		

	},
	[codeInput, scan],
);


// end payment prorcess



const onDateSetRetrival = (e: React.FormEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>, selectedId: string, formikProps: FormikProps<any>) => {

	let value = '';

	if ('currentTarget' in e) {
		value = (e.currentTarget as HTMLInputElement).value;
	} 

	let chosenYear = new Date(value).getFullYear();
	let currentYear = new Date().getFullYear();
	let dateDiff = Math.abs(currentYear - chosenYear);

		
		formikProps.setFieldValue(`${selectedId}.birthdate`, value);
		formikProps.setFieldValue(`${selectedId}.age`, dateDiff);


};
// onActiveIndicatorMode

useEffect(() => {
	return setActive({ isActive: true });
}, [isActive]);


	return (
		<RenderIf value={!toggle}>
			<RenderIf value={tabValue == 0}>
				<main className='col-start-1 -col-end-1 row-start-2 row-end-2 min-h-[40vh] h-auto background-design'>
					<Stepper isActive={isActive} index={tabValue} />
					<Formik
						initialValues={{
							senior: passenger.senior,
							students: passenger.student,
							regulars: passenger.regular,
							child: passenger.child,
							infant: passenger.infant,
							pwd: passenger.pwd,

							seniorPassenger: Array.from({ length: passenger.senior }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'senior',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 757,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),
							pwdPassenger: Array.from({ length: passenger.pwd }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'pwd',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 757,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),
							studentPassengers: Array.from({ length: passenger.student }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'student',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 848,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),
							childPassengers: Array.from({ length: passenger.child }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'child',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 530,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),
							regularPassengers: Array.from({ length: passenger.regular }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'regular',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 1060,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),

							infantPassengers: Array.from({ length: passenger.infant }, () => ({
								firstname: '',
								lastname: '',
								age: 0,
								gender: '',
								fare_type: 'infant',
								seatPosition: '',
								seatNumber: '',
								rangePrice: 60,
								birthdate: dateNow,
								personal_id: userProfileDetails?.personal_id,
								vehicleChosen: {
									owner_name: '',
									plate_number: '',
									vehicletype_id: '0',
								},
							})),
						}}
						validationSchema={formSchema}
						onSubmit={async (values, { setSubmitting }) => {
							setLoader(true);

							await waitSec(2000);

							setLoader(false);
							// Handle form submission

							console.log(values);

							const seniorOverridePassenger = values.seniorPassenger.map((item) => ({ ...item, vehicletype_id: item.vehicleChosen.vehicletype_id.split(',')[0] ?? '0' }));
							const studentOverridePassenger = values.studentPassengers.map((item) => ({ ...item, vehicletype_id: item.vehicleChosen.vehicletype_id.split(',')[0] ?? '0' }));
							const regularOverridePassenger = values.regularPassengers.map((item) => ({ ...item, vehicletype_id: item.vehicleChosen.vehicletype_id.split(',')[0] ?? '0' }));
							const pwdOverridePassenger = values.pwdPassenger.map((item) => ({ ...item, vehicletype_id: '0' }));
							const childOverridePassenger = values.childPassengers.map((item) => ({ ...item, vehicletype_id: '0' }));
							const infantOverridePassenger = values.infantPassengers.map((item) => ({ ...item, vehicletype_id: '0' }));

							const payload = {
								isSubmitted: true,
								seniorPassenger: seniorOverridePassenger,
								pwdPassenger: pwdOverridePassenger,
								studentPassengers: studentOverridePassenger,
								regularPassengers: regularOverridePassenger,
								childPassengers: childOverridePassenger,
								infantPassengers: infantOverridePassenger,
							};

							dispatch(storePassengerForm(payload));

							setDisplayValue(values);
							// Add your submission logic here
							setSubmitting(false); // Ensure to reset form submission status

							setActive({ isActive: true, index: 1 });
							setCurrentTab(1);
						}}
					>
						{(formikProps) => (
							<Form className='my-12'>
								{/* Input fields for counts of adults, students, and minors */}
								{/* <Field name='adults' type='number' />
							<Field name='students' type='number' />
							<Field name='minors' type='number' /> */}

								{/* {!isEmpty(displayError) && <div className='text-lite font-bold py-3 px-5 bg-accent text-center'>{displayError}</div>} */}

								{[...Array(formikProps.values.senior)].map((_, index) => (
									<div key={`senior-${index}`}>
										{/* // @ts-ignore */}

										<PassengerFormDetails identifyAs={`seniorPassenger.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.seniorPassenger[index].seatNumber} onSeatChosen={() => onSeat('seniorPassenger', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'seniorPassenger', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'seniorPassenger', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Senior'} onDateGetAge={(e) => onDateSetRetrival(e, `seniorPassenger.${index}`, formikProps)} />
									</div>
								))}

								{[...Array(formikProps.values.pwd)].map((_, index) => (
									<div key={`pwd-${index}`}>
										{/* // @ts-ignore */}
										<PassengerFormDetails identifyAs={`pwdPassenger.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.pwdPassenger[index].seatNumber} onSeatChosen={() => onSeat('pwdPassenger', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'pwdPassenger', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'pwdPassenger', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Pwd'} onDateGetAge={(e) => onDateSetRetrival(e, `pwdPassenger.${index}`, formikProps)} />
									</div>
								))}

								{[...Array(formikProps.values.students)].map((_, index) => (
									<div key={`students-${index}`}>
										{/* // @ts-ignore */}
										<PassengerFormDetails identifyAs={`studentPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.studentPassengers[index].seatNumber} onSeatChosen={() => onSeat('studentPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'studentPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'studentPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Student'} onDateGetAge={(e) => onDateSetRetrival(e, `studentPassengers.${index}`, formikProps)} />

										{/* <InputFieldForm type='hidden' identifyAs={`studentPassengers.${index}`} fieldName='vehicletype_id' value={formikProps.values.seniorPassenger[index].vehicleChosen.vehicletype_id.split(',')[0] ?? undefined} /> */}
									</div>
								))}

								{[...Array(formikProps.values.regulars)].map((_, index) => (
									<div key={`regulars-${index}`}>
										{/* // @ts-ignore */}
										<PassengerFormDetails identifyAs={`regularPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.regularPassengers[index].seatNumber} onSeatChosen={() => onSeat('regularPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'regularPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'regularPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Regular'} onDateGetAge={(e) => onDateSetRetrival(e, `regularPassengers.${index}`, formikProps)} />
										{/* <InputFieldForm type='hidden' identifyAs={`regularPassengers.${index}`} fieldName='vehicletype_id' value={formikProps.values.seniorPassenger[index].vehicleChosen.vehicletype_id.split(',')[0] ?? undefined} /> */}
									</div>
								))}

								{[...Array(formikProps.values.child)].map((_, index) => (
									<div key={`child-${index}`}>
										{/* // @ts-ignore */}
										<PassengerFormDetails identifyAs={`childPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.childPassengers[index].seatNumber} onSeatChosen={() => onSeat('childPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'childPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'childPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Child'} onDateGetAge={(e) => onDateSetRetrival(e, `childPassengers.${index}`, formikProps)} />
									</div>
								))}

								{[...Array(formikProps.values.infant)].map((_, index) => (
									<div key={`infant-${index}`}>
										{/* // @ts-ignore */}
										<PassengerFormDetails identifyAs={`infantPassengers.${index}`} indexLabel={index ?? ''} seatNumber={formikProps.values.infantPassengers[index].seatNumber} onSeatChosen={() => onSeat('infantPassengers', index)} onPassengerVehicleAdd={() => onPassengerVehicle('add', 'infantPassengers', index, formikProps)} onPassengerVehicleRemove={() => onPassengerVehicle('remove', 'infantPassengers', index, formikProps)} vehicleCondition={passengerVehicle} passengerType={'Infant'} onDateGetAge={(e) => onDateSetRetrival(e, `infantPassengers.${index}`, formikProps)} />
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
										<RenderIf value={!isEmpty(seatChosen)}>
											<div className='flex justify-end'>
												<span onClick={() => onSeatSelectedClear(formikProps as any)} className='bg-red-600 text-white px-1 rounded cursor-pointer my-2' title='Remove selected chair'>
													&times;
												</span>
											</div>
										</RenderIf>
										<div style={{ display: 'flex', flexDirection: 'column' }}>{renderSeats(formikProps as any)}</div>
									</PopupModal>
								</RenderIf>
							</Form>
						)}
					</Formik>
				</main>
			</RenderIf>
			<RenderIf value={tabValue == 1}>
				<main className='col-start-1 -col-end-1 row-start-2 row-end-2 min-h-[40vh] h-auto background-design'>
					<Stepper isActive={isActive} index={tabValue} />
					<div className='flex flex-col gap-5  w-9/12 mx-auto rounded shadow-md p-10 my-12 borderGeray'>
						<div className='relative flex justify-between gap-1 my-4 bg-white rounded-md'>
							<div className='flex flex-col gap-2 w-full px-4'>
								<div className='flex justify-between items-start mb-8'>
									<p className='ml-5 font-medium text-navy'>Arrival date:</p>
									<p className='ml-5'>{dateArrival(getParamsSchedule?.arrival_date as string)}</p>
								</div>
								<div className='route flex justify-between items-center pl-5 leading-6 w-9/12 route h-full mx-auto'>
									<i id='routeA'>
										<GiCargoShip fontSize={40} />
									</i>
									<label htmlFor='routeA' className='font-medium'>
										{getParamsSchedule?.origin ?? ''}
									</label>
									<label className='font-bold text-xl text-navy'>-</label>
									<label className='font-medium' htmlFor='routeB'>
										{getParamsSchedule?.destination ?? ''}
									</label>
									<i id='routeB'>
										<GiCargoShip fontSize={40} style={{ transform: 'scaleX(-1)' }} />
									</i>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-5  w-9/12 mx-auto rounded shadow-md p-10 my-12 borderGeray'>
						<div className='flex items-evenly items-center flex-col gap-1'>
							<a target='blank' href={`${Immutable.API}/vehicle?photo=${getParamsSchedule?.vehicle.vehicle_id as string}`}>
								<img src={`${Immutable.API}/vehicle?photo=${getParamsSchedule?.vehicle.vehicle_id as string}`} className='object-contain rounded' width={80} height={100} />
							</a>
							<div className='flex'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Vessel:
								</label>
								<p className='font-normal ml-2'>
									{getParamsSchedule?.vehicle.vehicle_name}
									<span className='font-medium ml-2'>({getParamsSchedule?.vehicle.vehicle_type})</span>
								</p>
							</div>
						</div>
						<div className='flex justify-between items-baseline gap-2'>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Passenger Assigned:
								</label>
								<p className='font-normal'>({displayFullName(userProfileDetails?.firstname, userProfileDetails?.midlename, userProfileDetails?.lastname)})</p>
							</div>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Email Assigned:
								</label>
								<p className='font-normal'>({user?.email})</p>
							</div>
						</div>
						<div className='flex justify-between items-baseline gap-2'>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Contact Number:
								</label>
								<p className='font-normal'>({userProfileDetails?.mobileNumber})</p>
							</div>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Address
								</label>
								<p className='font-normal'>({userProfileDetails?.address})</p>
							</div>
						</div>
						<div className='flex justify-between items-baseline gap-2'>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Fare list:
								</label>
								<p className='font-normal'>{passegerList()}</p>
							</div>
							<div className='flex gap-1'>
								<label htmlFor='pasengerNumber' className='font-medium'>
									Number of passenger
								</label>
								<p className='font-normal'>({passenger.totalCount})</p>
							</div>
						</div>
						<hr />
						<div className='flex gap-5 '>
							<label htmlFor='total' className='font-medium'>
								<p>
									Passenger fare rate: <span className='capitalize'>{passenger.passengerClass}</span>{' '}
								</p>
							</label>
							<span className='capitalize font-medium'>{calculatePassengers()[0]}</span>
						</div>

						<div className='flex justify-end'>
							<label htmlFor='total' className='font-medium'>
								Passenger Amount
							</label>
							<p className='font-normal'>
								{' '}
								&nbsp; &#8369; <span className='font-medium'>{Number(calculatePassengers()[1]).toFixed(2)}</span>
							</p>
						</div>

						<RenderIf value={Number(calculatePassengersVehicle()[1]) > 0}>
							<div className='flex gap-5  border-b py-4'>
								<label htmlFor='total' className='font-medium'>
									<p>Vehicle Chosen:</p>
								</label>
								<span className='capitalize font-medium'>{calculatePassengersVehicle()[0]}</span>
							</div>
							<div className='flex justify-end '>
								<label htmlFor='total' className='font-medium'>
									Vehicle Amount
								</label>
								<p className='font-normal'>
									{' '}
									&nbsp; &#8369; <span className='font-medium'>{Number(calculatePassengersVehicle()[1]).toFixed(2)}</span>
								</p>
							</div>
						</RenderIf>
						<RenderIf value={passenger.senior > 0 || passenger.pwd > 0}>
							<div className='flex justify-end '>
								<label htmlFor='total' className='font-medium'>
									Senior/Pwd discount
								</label>
								<p className='font-normal'>
									{' '}
									&nbsp; <span className='font-medium'>{Number(20)}%</span>
								</p>
							</div>
						</RenderIf>
						<div className='flex justify-end '>
							<label htmlFor='total' className='font-medium'>
								Service/Terminal fee:
							</label>
							<p className='font-normal'>
								{' '}
								&nbsp; &#8369; <span className='font-medium'>{Number(20)} x 2</span>
							</p>
						</div>
						<div className='flex justify-end '>
							<label htmlFor='total' className='font-medium'>
								Total
							</label>
							<p className='font-normal'>
								{' '}
								&nbsp; &#8369; <span className='font-medium'>{Number(Number(calculatePassengers()[1]) + Number(calculatePassengersVehicle()[1])).toFixed(2)}</span>
							</p>
						</div>
						<div className='flex justify-end mt-4'>
							<CustomButton className='w-2/12' label='Place order' onClick={onPaymentProcess} />
						</div>
						<RenderIf value={payModal}>
							<PopupModal>
								<div className='text-center'>
									<p className='font-semibold text-2xl my-4'>Payment options</p>
								</div>
								<div className='flex justify-center gap-5 flex-wrap w-[30rem] h-[10rem] mt-8 relative z-10'>
									<div>
										<div className=' flex items-baseline gap-2 shadow-md p-10 bg-indigo-500 text-white rounded cursor-pointer' onClick={onPaymentProceeed}>
											<label htmlFor='reload' className='font-medium cursor-pointer'>
												Buy RFID
											</label>
											<i id='reload'>
												<BiRfid />
											</i>
										</div>
									</div>
									<div>
										<div className=' flex items-baseline gap-2 shadow-md p-10 bg-accent text-white rounded cursor-pointer' onClick={OnRFIDScannerShow}>
											<label htmlFor='buy' className='font-medium cursor-pointer'>
												Use RFID
											</label>
											<i id='buy'>
												{' '}
												<BiRfid />
											</i>
										</div>
									</div>
								</div>
								<div style={{ clipPath: 'ellipse(40% 40% at 24% 21%)' }} className='absolute  left-0 top-0 right-0 bottom-0 w-[15rem] h-[15rem] bg-accent z-999'></div>
								<div style={{ position: 'absolute', bottom: '0px', right: '0', zIndex: '0', clipPath: 'ellipse(41% 42% at 82% 87%)' }} className='w-[15rem] h-[15rem] bg-indigo-500'></div>
							</PopupModal>
						</RenderIf>

						<RenderIf value={scannerPaymentState}>
							<PopupModal onClose={onCloseRfid}>
								<div className='p-2'>
									{/* <p className='text-navy text-center text-xl my-2 break-words'>{scan}</p> */}
									<RFIDScannerDevice scan={scan} handleEnableFocus={() => {}} scanning={scanner} inputRef={inputRFIDRef} handleScannerDevice={handlerScanningDevice} onCodeInput={handleRFIDCode} onSubmit={OnRFIDWalletCheck}/>;
								</div>
							</PopupModal>
						</RenderIf>
					</div>
				</main>
			</RenderIf>
			<RenderIf value={tabValue == 3}>
				<div>Payment List</div>
			</RenderIf>

			<LoaderSpinner load={loader} />
		</RenderIf>
	);
};

export default BookingById;
