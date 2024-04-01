import React, { useEffect, useState } from 'react'
import LoaderSpinner from '../../../../common/widget/loader';
import { useGlobaLoader } from '../../../../utils/hooks/globa.state';
import  CheckVerification from '../../../../assets/check_verification.svg'
import ErrorVerification from '../../../../assets/error_verification.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import waitSec from '../../../../utils/setTimeout';
import { usePaymentProcessMutation } from '../../../../api-query/payment-api';
import { PaymentProcess } from '../../../../api-query/types';
import { RootState, useAppSelector } from '../../../../utils/redux/store';
import { useGetPersonalDetailsByIdQuery } from '../../../../api-query/personal-details.api';
import { enqueueSnackbar } from 'notistack';

const PaymentBox:React.FC = () => {
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [status,setStatus] = useState('Completed');

	const [loader, setLoader] = useGlobaLoader();

	const [paymentProcess] = usePaymentProcessMutation();


	const params = useParams();



	const user = useAppSelector((state:RootState) => state.authUser)


	const { data: userProfileDetails } = useGetPersonalDetailsByIdQuery(user.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const  passengers =  useAppSelector((state:RootState) => state.passengerFormDetails);
	const paymentForm = useAppSelector((state:RootState) => state.paymentProcess);



useEffect(() => {
	async function init() {
		if (searchParams.get('status') !== 'success') {
			setLoader(true);
			setStatus('Failed');
			await waitSec(3000);
			setLoader(false);
			navigate('/booking/88ed9bb0-6be6-4f95-b02a-5cb7dc2a1ca5');
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
					setStatus('Completed');

		

			if(paymentSend.data === 'payment success'){
				enqueueSnackbar('Transaction completed',{variant:'success', autoHideDuration:3000})
			}else{
				enqueueSnackbar('Wallet existed', { variant: 'warning', autoHideDuration: 3000 });
					setStatus('Wallet existed');

			}

				
			} catch (error) {
				
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
