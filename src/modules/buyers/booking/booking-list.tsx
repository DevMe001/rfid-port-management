import React, { useEffect, useState } from 'react'
import { useGetBookignScheduleQuery } from '../../../api-query/schedule-list.api';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import RenderIf from '../../../common/components/ui/render-if';
import { isEmpty, isUndefined } from 'lodash';
import { BookingSchedules } from '../../../api-query/types';
import Immutable from '../../../immutable/constant';
import '../styles/book-list.css';
import { GiCargoShip } from "react-icons/gi";
import useToggleAuth from '../../../utils/hooks/useToggleAuth';
import { useAppDispatch, useAppSelector } from '../../../utils/redux/store';
import { onToggleBookingModal } from '../../../utils/hooks/globa.state';
import PopupModal from '../../../common/widget/modal/popup.,modal';

import { PiUsersThreeFill } from 'react-icons/pi';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FiMinusCircle } from 'react-icons/fi';
import { storePassengerNumber } from '../../../utils/redux/slicer/passengerSlice';


interface Counters {
	student: number;
	regular: number;
	adult: number;
	minor: number;
}
const initialCounters: Counters = {
	student: 0,
	regular: 0,
	adult: 0,
	minor: 0,
};

const BookingRecentList = () => {

  // const { data, isError } = useGetBookignScheduleQuery({}, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });


  const { data, isError } = useGetBookignScheduleQuery({}, { pollingInterval: 3000, refetchOnMountOrArgChange: false, skip: false });
  const navigate = useNavigate();
  const {onOpen} = useToggleAuth();
  const user = useAppSelector((state) => state.authUser);
  const [bookingModal, setBookingModal] = onToggleBookingModal();
  const [selected, setSelected] = useState<BookingSchedules | Record<string,any>>({});
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [{ student, regular, adult, minor }, setCounters] = useState<Counters>(initialCounters);

  useEffect(() => {
		if (isError) {
      enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 5000 });
      navigate('/');
		}
	}, [isError]);


   const onBooking = (schedule:BookingSchedules) => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
      document.body.style.overflow = 'hidden';

      setSelected(schedule);

     if(isEmpty(user.accessToken)) onOpen;
     else setBookingModal(!bookingModal);

		  document.body.style.overflow = 'auto';
		};


  const onBoxShow = ()=>{
    setDropdown(!dropdown);
  };

	//  const increment = (type: keyof Counters) => {
	// 		setCounters((prevCounters) => ({
	// 			...prevCounters,
	// 			[type]: prevCounters[type] >= 0 && prevCounters[type] < 10 ? prevCounters[type] + 1 : prevCounters[type],
	// 		}));
	// 	};

	const increment = (type: keyof Counters) => {
		setCounters((prevCounters) => {
			let incrementValue = 1; // Default increment value
			// Check type and set maximum limits
			if (type === 'minor') {
				if (prevCounters[type] >= 0 && prevCounters[type] < 4) {
					incrementValue = 1; // Increment allowed for minor
				} else {
					incrementValue = 0; // No increment allowed beyond 4
				}
			} else if (type === 'adult') {
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

		const decrement = (type: keyof Counters) => {
			setCounters((prevCounters) => ({
				...prevCounters,
				[type]: prevCounters[type] > 0 ? prevCounters[type] - 1 : 0,
			}));
		};


		let totalPassenger = adult + student + regular + minor;


const dispatch = useAppDispatch();

		const onRouteBookingById = (id:string)=>{
			if(totalPassenger > 0) navigate(`/booking/${id}`);

			dispatch(storePassengerNumber({ totalCount: totalPassenger ,adult:adult,student:student,regular:regular,minor:minor}));
		}

function dateArrival(arrivalSchedule: string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};
  	// 	timeZone: 'UTC'
		// timeZoneName: 'short'

	let dateLocale = new Date(arrivalSchedule);

	if (isNaN(dateLocale.getTime())) {
		return 'Invalid Date';
	}

	return dateLocale.toLocaleString('en-US', options);
}

  return (
		<>
			<RenderIf value={!isEmpty(data) || !isUndefined(data)}>
				<div className='max-w-[45rem] mx-auto w-full h-[8rem] py-2 '>
					<h2 className='font-bold'>Recommended</h2>
					{!isEmpty(data) &&
						data?.map((schedule: BookingSchedules, i) => (
							<>
								<div key={i} className='relative flex justify-between gap-1 border border-1 border-gray-200 my-4 bg-white p-5 rounded-md'>
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
										<button className='btn bg-accent text-white text-sm' onClick={() => onBooking(schedule)}>
											Book now
										</button>
									</div>
								</div>
							</>
						))}
					<RenderIf value={bookingModal == true}>
						<PopupModal>
							<div>
								{/* add passenger numbers */}
								<label htmlFor='' className='font-medium'>Number of passengers</label>
								<div onClick={onBoxShow} className='w-[20rem] h-[2.5rem] bg-lite text-navy borderLite passenger-box'>
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
									<div onMouseLeave={() => setDropdown(false)} className='w-[20rem] h-[8rem] bg-lite text-navy borderLite cursor-pointer animate-slideDown px-5 py-2'>
										
											{/* adults */}
											<div className='flex justify-between items-center'>
												<div className='w-6/12'>Adult</div>
												<div className='flex justify-between w-6/12'>
													<FiMinusCircle onClick={() => decrement('adult')} />
													<span className='font-medium'>{adult}</span>
													<IoAddCircleOutline onClick={() => increment('adult')} />
												</div>
											</div>
											{/* student */}
											<div className='flex justify-between items-center'>
												<div className='w-6/12'>Students</div>
												<div className='flex justify-between w-6/12'>
													<FiMinusCircle onClick={() => decrement('student')} />
													<span className='font-medium'>{student}</span>
													<IoAddCircleOutline onClick={() => increment('student')} />
												</div>
											</div>
											{/* regular */}
											<div className='flex justify-between items-center'>
												<div className='w-6/12'>Regular</div>
												<div className='flex justify-between w-6/12'>
													<FiMinusCircle onClick={() => decrement('regular')} />
													<span className='font-medium'>{regular}</span>
													<IoAddCircleOutline onClick={() => increment('regular')} />
												</div>
											</div>
											{/* minor */}
											<div className='flex justify-between items-center'>
												<div className='w-6/12'>Minor</div>
												<div className='flex justify-between w-6/12'>
													<FiMinusCircle onClick={() => decrement('minor')} />
													<span className='font-medium'>{minor}</span>
													<IoAddCircleOutline onClick={() => increment('minor')} />
												</div>
											</div>
									
									</div>
								</RenderIf>
								<div className='flex justify-center my-5'>
									<button className='btn bg-accent text-white text-sm' onClick={()=>onRouteBookingById(selected.schedule_id)}>Proceed</button>
								</div>
							</div>
						</PopupModal>
					</RenderIf>
				</div>
			</RenderIf>
			<RenderIf value={isEmpty(data)}>
				<p>No booking available</p>
			</RenderIf>
		</>
	);
}

export default BookingRecentList
