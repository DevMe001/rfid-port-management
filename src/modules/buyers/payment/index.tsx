import React, { useCallback, useEffect, useState } from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import FooterMd from '../../onboarding-flow/layout/homepage-footer-md';
import FooterXS from '../../onboarding-flow/layout/homepage-footer-sm';
import { onToggleNavHomepageMobile, useGlobaLoader } from '../../../utils/hooks/globa.state';
import Headers from '../../onboarding-flow/layout/homepage-headers';
import PaymentBox from './components/main';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePaymentProcessMutation } from '../../../api-query/payment-api';
import { useGetPersonalDetailsByIdQuery } from '../../../api-query/personal-details.api';
import { PaymentProcess } from '../../../api-query/types';
import { resetPassengerForm } from '../../../utils/redux/slicer/passengerformSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../../utils/redux/store';
import waitSec from '../../../utils/setTimeout';

const Payment: React.FC = () => {
	const [toggle] = onToggleNavHomepageMobile();

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();

	const [status, setStatus] = useState('');
	const [, setLoader] = useGlobaLoader();

	const [paymentProcess] = usePaymentProcessMutation();
	const dispatch = useAppDispatch();

	
	const passengers = useAppSelector((state: RootState) => state.passengerFormDetails);
	const paymentForm = useAppSelector((state: RootState) => state.paymentProcess);
	const locatePath = location.pathname.split('/')[2];
	const [rfIDCode,setCode] = useState<string>('');
	const [acct, setaccount] = useState<string>('');
	
	const params = useParams();


	const paymentRequest = useCallback(async () => {
	
		const passengerList = [...passengers.seniorPassenger, ...passengers.pwdPassenger, ...passengers.studentPassengers, ...passengers.childPassengers, ...passengers.infantPassengers];
		const seatList = passengerList.map((item) => item.seatPosition).join(', ');


	
		const paymentForms: PaymentProcess = {
			personal_id: paymentForm.personal_id,
			ewallet: {
				balance: paymentForm.amount,
				is_taken: 1,
				status: 'pending',
				personal_id: paymentForm.personal_id,
			},
			passengers: passengerList,
			booking: {
				seat_numbers: seatList,
				amount: paymentForm.amount,
				service_charge: 40,
				schedule_id: params.bookId as string,
				vehicle_id: paymentForm.vehicle_id ?? '0',
				status: 'pending',
			},
		};

		const paymentSend: any = await paymentProcess(paymentForms);

		try {
			setLoader(true);
			await waitSec(3000);
			setLoader(false);

			console.log(paymentSend);

			if (!paymentSend.data.message.includes('payment success')) {
				const msg = paymentSend.data.message ?? 'Wallet existed';
				enqueueSnackbar(msg, { variant: 'warning', autoHideDuration: 3000 });
				setStatus(msg ?? 'Wallet existed');
				
				// navigate(`/booking/${locatePath}`);

				
			} else {
				enqueueSnackbar('Transaction completed', { variant: 'success', autoHideDuration: 3000 });
				
				setStatus('Completed');	
				await waitSec(2000);
				setCode(paymentSend?.data?.code as string);
				setaccount(paymentSend?.data?.rfid as string);
				 dispatch(resetPassengerForm());
				// navigate(`/booking`);

			}
		} catch (error) {
			console.error('Error in paymentRequest:', error);
		}
	}, [passengers, paymentForm, enqueueSnackbar, setStatus, dispatch, setLoader, paymentProcess]);

	useEffect(() => {
		async function init() {
			if (searchParams.get('status') === 'success') {
				await paymentRequest();
			} else {
				setLoader(true);
				setStatus('Failed');
				await waitSec(3000);
				setLoader(false);
				
			}
		}
		init();
	}, [searchParams.get('status'), paymentRequest, setLoader, setStatus, navigate, locatePath]);

	return (
		<div className='relative grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh repeat(2,1fr) 10vh' }}>
			<Headers />
			<PaymentBox status={status} rfIDCode={rfIDCode} account={acct} />
			<RenderIf value={!toggle}>
				<FooterMd />
				<FooterXS />
			</RenderIf>
		</div>
	);
};

export default Payment;
