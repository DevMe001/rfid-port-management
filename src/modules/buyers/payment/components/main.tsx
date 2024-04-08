import React, { useEffect, useState } from 'react'
import LoaderSpinner from '../../../../common/widget/loader';
import { useGlobaLoader } from '../../../../utils/hooks/globa.state';
import  CheckVerification from '../../../../assets/check_verification.svg'
import ErrorVerification from '../../../../assets/error_verification.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import waitSec from '../../../../utils/setTimeout';
import { usePaymentProcessMutation } from '../../../../api-query/payment-api';
import { PaymentProcess } from '../../../../api-query/types';
import { RootState, useAppDispatch, useAppSelector } from '../../../../utils/redux/store';
import { useGetPersonalDetailsByIdQuery } from '../../../../api-query/personal-details.api';
import { enqueueSnackbar } from 'notistack';
import { resetPassengerForm } from '../../../../utils/redux/slicer/passengerformSlice';

const PaymentBox:React.FC = () => {
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [status,setStatus] = useState('Completed');

	const [loader, setLoader] = useGlobaLoader();

	const [paymentProcess] = usePaymentProcessMutation();

	const dispatch = useAppDispatch();



	
	const user = useAppSelector((state:RootState) => state.authUser)


	const { data: userProfileDetails } = useGetPersonalDetailsByIdQuery(user.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const  passengers =  useAppSelector((state:RootState) => state.passengerFormDetails);
	const paymentForm = useAppSelector((state:RootState) => state.paymentProcess);

	const locatePath = location.pathname.split('/')[2];


useEffect(() => {
	async function init() {
		if (searchParams.get('status') !== 'success') {
			setLoader(true);
			setStatus('Failed');
			await waitSec(3000);
			setLoader(false);
			navigate(`/booking/${locatePath}`);
		} else {
			paymentRequest(); // Ensure this function doesn't trigger a state update that causes infinite loop
		}
	}

	init();
}, [searchParams.get('status')]);



async function paymentRequest(){

	const userId = userProfileDetails?.personal_id as string;




	const passengerList = [...passengers.seniorPassenger,...passengers.pwdPassenger,...passengers.studentPassengers,...passengers.childPassengers,...passengers.infantPassengers];

	const seatList = passengerList.map((item) => item.seatPosition).join(', ');

	
			const paymentForms: PaymentProcess = {
				personal_id: userId,
				ewallet: {
					balance: paymentForm.amount,
					is_taken: 1,
					status: 'pending',
					personal_id: userId,
				},
				passengers: passengerList,
				booking: {
					seat_numbers: seatList,
					amount: paymentForm.amount,
					service_charge: 40,
					schedule_id: paymentForm.schedule_id,
					vehicle_id: paymentForm.vehicle_id,
					status: 'pending',
				},
			};

			const paymentSend:any = await paymentProcess(paymentForms);

			try {
				   setLoader(true);
					await waitSec(3000);
					setLoader(false);
				
			console.log(paymentSend);

			if(paymentSend.data.message.includes('payment succes')){
				enqueueSnackbar('Transaction completed',{variant:'success', autoHideDuration:3000})
				setStatus('Completed');
				dispatch(resetPassengerForm());

				await waitSec(2000);
				navigate(`/booking`);

			}else{

				const msg = paymentSend.data.message ?? 'Wallet existed'; 
				enqueueSnackbar(msg, { variant: 'warning', autoHideDuration: 3000 });
					setStatus(msg ?? 'Walet existed');
					
					navigate(`/booking/${locatePath}`);


			}

				
			} catch (error) {
				console.log(error)
			}

}



	return (
		<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[30vh] mt-20'>
			<div className='flex justify-center items-center w-full h-auto'>
				<div className=' flex flex-col justify-center items-center bg-white shadow-md mx-auto  w-[40rem] h-auto pb-20 border border-1 border-teal-200 rounded'>
					<img src={status === 'Completed' ? CheckVerification : ErrorVerification} className='w-[90rem ] h-[15rem]' />
					<p className='text-accent font-medium text-xl'>{status}</p>
				</div>
			</div>
			<LoaderSpinner load={loader} />
		</main>
	);
}

export default PaymentBox
