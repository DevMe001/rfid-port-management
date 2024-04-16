import React, { useEffect, useState, ChangeEvent } from 'react';
import { useGetBookingScheduleQuery } from '../../../api-query/schedule-list.api';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RenderIf from '../../../common/components/ui/render-if';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { BookingSchedules } from '../../../api-query/types';
import Immutable from '../../../immutable/constant';
import '../styles/book-list.css';
import { GiCargoShip } from "react-icons/gi";
import useToggleAuth from '../../../utils/hooks/useToggleAuth';
import { RootState, useAppDispatch, useAppSelector } from '../../../utils/redux/store';
import { onToggleBookingModal, useGlobaLoader, useSelectIndex } from '../../../utils/hooks/globa.state';
import PopupModal from '../../../common/widget/modal/popup.,modal';

import { PiUsersThreeFill } from 'react-icons/pi';
import { PassengerClass, storePassengerNumber } from '../../../utils/redux/slicer/passengerSlice';
import waitSec from '../../../utils/setTimeout';
import PassengerMenuList from './components/dropdown-passenger-list';
import CustomButton from '../../../common/components/ui/button.componetnt';
import dateArrival from '../../../utils/dateFormat';
import { useGetPersonalDetailsByIdQuery } from '../../../api-query/personal-details.api';
import LoaderSpinner from '../../../common/widget/loader';
import { storeChat } from '../../../utils/redux/slicer/chatSlice';


interface PassengerType{
	senior: number;
	regular: number;
	student: number;
	child: number;
	infant: number;
	pwd:number;
	
}
const initialPassengerClass: PassengerType = {
	senior: 0,
	regular: 0,
	student: 0,
	child: 0,
	infant: 0,
	pwd:0
};

interface FareClass {
	isActiveError?: boolean;
	fare_type?: PassengerClass;
}

const BookingRecentList: React.FC = () => {
	// const { data, isError } = useGetBookignScheduleQuery({}, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
	const authUser = useAppSelector((state:RootState) => state.authUser);

	const [loader,setLoader] = useGlobaLoader();


	
	const { data, isError } = useGetBookingScheduleQuery({}, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
	const { data: getPersonalByInformation, isError:isPersonalInformationError } = useGetPersonalDetailsByIdQuery(authUser.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const navigate = useNavigate();
	const { onOpen } = useToggleAuth();
	const user = useAppSelector((state) => state.authUser);
	const [bookingModal, setBookingModal] = onToggleBookingModal();
	const [selected, setSelected] = useState<BookingSchedules | Record<string, any>>({});
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [{ senior, regular, student, child, infant,pwd }, setCounters] = useState<PassengerType>(initialPassengerClass);
	const [,setSelectedIndex] = useSelectIndex();

	const [{ isActiveError, fare_type }, setFareClass] = useState<FareClass>({
		isActiveError: false,
		fare_type: '',
	});

	// useEffect(() => {
	// 	async function init(){
	// 		if (isError || isPersonalInformationError) {
	// 		setLoader(true);
	// 		enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 5000 });
	// 		await waitSec(3000);
	// 		setLoader(false);
	// 		navigate('/');
	// 	}
	// 	}
	// 	init();
	// }, [isError]);

	const onBooking = (schedule: BookingSchedules) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';

		setSelected(schedule);

		if (isEmpty(user.accessToken)){
			 onOpen();
			 	dispatch(storeChat({ urlPath: '/booking' }));
		}
		else {
			setBookingModal(!bookingModal)
		

		}
	};

	const onBoxShow = () => {
		setDropdown(!dropdown);
	};
	

const handlerPassengerClass = (e: ChangeEvent<HTMLSelectElement>) => {
	const selectedClass: PassengerClass = e.target.value as PassengerClass;
	console.log(selectedClass);
	setFareClass({ fare_type: selectedClass });
};
	//  const increment = (type: keyof Counters) => {
	// 		setCounters((prevCounters) => ({
	// 			...prevCounters,
	// 			[type]: prevCounters[type] >= 0 && prevCounters[type] < 10 ? prevCounters[type] + 1 : prevCounters[type],
	// 		}));
	// 	};

	const increment = (type: keyof PassengerType) => {
		setCounters((prevCounters) => {
			let incrementValue = 1; // Default increment value
			// Check type and set maximum limits
			if (type === 'child' || type === 'infant') {
				if (prevCounters[type] >= 0 && prevCounters[type] < 4) {
					incrementValue = 1; // Increment allowed for minor
				} else {
					incrementValue = 0; // No increment allowed beyond 4
				}
			} else if (type === 'senior' || type === 'pwd') {
				if (prevCounters[type] >= 0 && prevCounters[type] < 7) {
					incrementValue = 1; // Increment allowed for adult, less than 7
				} else {
					incrementValue = 0; // No increment allowed beyond 7
				}
			} else if (type === 'regular' || type === 'student') {
				if (prevCounters[type] >= 0 && prevCounters[type] < 9) {
					incrementValue = 1; // Increment allowed for regular and student, less than 9
				} else {
					incrementValue = 0; // No increment allowed beyond 9
				}
			}

			// Apply increment
			return {
				...prevCounters,
				[type]: prevCounters[type] + incrementValue,
			};
		});
	};

	const decrement = (type: keyof PassengerType) => {
		setCounters((prevCounters) => ({
			...prevCounters,
			[type]: prevCounters[type] > 0 ? prevCounters[type] - 1 : 0,
		}));
	};

	let totalPassenger = senior + student + regular + child + infant + pwd;

	const dispatch = useAppDispatch();

	const onRouteBookingById = async(id: string) => {

		try {
			
			if (!isNull(getPersonalByInformation)){

						setLoader(true);

						await waitSec(3000);
						setLoader(false);
				
					if (totalPassenger > 0) navigate(`/booking/${id}`);

					if (isEmpty(fare_type)) {
						setFareClass({ isActiveError: true });
						await waitSec(1000);
						setFareClass({ isActiveError: false });
					}

				dispatch(storePassengerNumber({ totalCount: totalPassenger, senior: senior, student: student, regular: regular, child: child, infant: infant,pwd:pwd, passengerClass: fare_type }));
			} else{

				enqueueSnackbar('Complete information first', { variant: 'warning', autoHideDuration: 3000 });

				setLoader(true);
					
			
				await waitSec(3000);
				setLoader(false);
				setSelectedIndex(2);
				
		
				navigate('/user-dashboard');

				
			}

			
		} catch (err) {
			console.log(err)
		}
		finally{

		setBookingModal(!bookingModal);

		}


	
	};

	

	return (
		<>
			<RenderIf value={!isEmpty(data) || !isUndefined(data)}>
				<div className='max-w-[45rem] mx-auto w-full h-[8rem] mt-8'>
					<h2 className='font-bold'>Recommended</h2>
					<hr className='borderGray mt-2' />
					{!isEmpty(data) &&
						data?.map((schedule: BookingSchedules) => (
							<div key={schedule.schedule_id} className='relative flex justify-between gap-1 border border-1 border-gray-200 my-4 bg-white p-5 rounded-md'>
								<div className='flex flex-col gap-2 indicator w-full px-4'>
									<div className='flex justify-between items-start mb-2'>
										<p className='ml-5'>Arrival date:</p>
										<p className='ml-5'> {dateArrival(schedule.arrival_date)}</p>
									</div>
									<div className='route flex justify-between items-center pl-5 leading-6 w-9/12 route h-full mx-auto'>
										<i id='routeA'>
											<GiCargoShip fontSize={40} />
										</i>
										<label htmlFor='routeA' className='font-medium'>
											{schedule.origin}
										</label>
										<label className='font-bold text-xl text-navy'>-</label>
										<label className='font-medium' htmlFor='routeB'>
											{schedule.destination}
										</label>
										<i id='routeB'>
											<GiCargoShip fontSize={40} style={{ transform: 'scaleX(-1)' }} />
										</i>
									</div>
								</div>
								<div className='flex flex-col justify-center items-center w-3/12 gap-5'>
									<a target='blank' href={`${Immutable.API}/vehicle?photo=${schedule.vehicle.vehicle_id}`}>
										<img src={`${Immutable.API}/vehicle?photo=${schedule.vehicle.vehicle_id}`} className='max-w-full' />
									</a>
									<CustomButton label={'Book Now'} className='btn bg-accent text-white text-sm' onClick={() => onBooking(schedule)} />
								</div>
							</div>
						))}
					<RenderIf value={bookingModal == true}>
						<PopupModal>
							<div className='flex flex-col flex-1 w-full my-5'>
								<label htmlFor='passengerClass' className='mb-1 font-medium'>
									Select fare class
								</label>
								<select name='passengerClass' id='passengerClass' className='w-full borderGray text-navy' onChange={handlerPassengerClass}>
									<option value=''>Choose type</option>
									<option value='economy'>Economy Class</option>
									<option value='tourist'>Tourist Class</option>
								</select>
								<RenderIf value={isActiveError as boolean}>
									<span className='text-red-400 font-medium text-center'>Field is not empty.</span>
								</RenderIf>
							</div>

							<div>
								{/* add passenger numbers */}
								<label htmlFor='' className='font-medium'>
									Number of passengers
								</label>
								<div onClick={onBoxShow} className='w-[20rem] h-[2.5rem]text-navy borderGray passenger-box'>
									<p className='flex gap-2 items-baseline p-2'>
										<span>
											<PiUsersThreeFill />
										</span>
										<label htmlFor=''>
											Passengers (<span className='font-medium'>{totalPassenger}</span>)
										</label>
									</p>
								</div>
								<RenderIf value={dropdown}>
									<div onMouseLeave={() => setDropdown(false)} className='w-[20rem] h-[10rem] text-navy borderLite cursor-pointer animate-slideDown px-5 py-2'>
										{/* adults */}

										<PassengerMenuList label='Senior' count={senior} onIncrement={() => increment('senior')} onDecrement={() => decrement('senior')} />
										<PassengerMenuList label='Pwd' count={pwd} onIncrement={() => increment('pwd')} onDecrement={() => decrement('pwd')} />

										<PassengerMenuList label='Student' count={student} onIncrement={() => increment('student')} onDecrement={() => decrement('student')} />

										<PassengerMenuList label='Regular' count={regular} onIncrement={() => increment('regular')} onDecrement={() => decrement('regular')} />

										<PassengerMenuList label='Child' count={child} onIncrement={() => increment('child')} onDecrement={() => decrement('child')} />

										<PassengerMenuList label='Infant' count={infant} onIncrement={() => increment('infant')} onDecrement={() => decrement('infant')} />
									</div>
								</RenderIf>
								<div className='flex justify-center items-center my-5'>
									<button className='btn bg-accent text-white text-sm text-center' onClick={() => onRouteBookingById(selected.schedule_id)}>
										Proceed
									</button>
								</div>
							</div>
						</PopupModal>
					</RenderIf>
				</div>
			</RenderIf>
			<RenderIf value={isEmpty(data)}>
				<div className='w-full h-auto flex justify-center items-center mt-20'>
					<div className='flex justify-center items-center w-[70%] h-[10rem] shadow-md rounded border border-1 border-teal-500'>
						<p className='text-red-500'>No booking available</p>
					</div>
				</div>
			</RenderIf>

			<LoaderSpinner load={loader}/>
		</>
	);
};

export default BookingRecentList
