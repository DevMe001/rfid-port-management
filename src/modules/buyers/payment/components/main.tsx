import React from 'react';
import LoaderSpinner from '../../../../common/widget/loader';
import { useGlobaLoader } from '../../../../utils/hooks/globa.state';
import  CheckVerification from '../../../../assets/check_verification.svg'
import ErrorVerification from '../../../../assets/error_verification.svg';
import RenderIf from '../../../../common/components/ui/render-if';
import { isEmpty } from 'lodash';

type PaymentProps = {
	status: string;
	rfIDCode:string;
	account:string;
};


const PaymentDetails: React.FC<PaymentProps> = ({ status, rfIDCode, account }) => {
	const [loader] = useGlobaLoader();

	return (
		<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[30vh] mt-20'>
			<div className='flex justify-center items-center w-full h-auto'>
				<div className=' flex flex-col justify-center items-center bg-white shadow-md mx-auto  w-[40rem] h-auto pb-20 border border-1 border-teal-200 rounded'>
					<RenderIf value={status !== ''}>
						<img src={status === 'Completed' ? CheckVerification : ErrorVerification} className='w-[90rem ] h-[15rem]' />
						<p className='text-accent font-medium text-xl'>{status}</p>
					</RenderIf>
					<RenderIf value={status === ''}>
						<img src={CheckVerification} />
						<p className='text-accent font-medium text-xl'>Please wait.....</p>
					</RenderIf>
					<RenderIf value={!isEmpty(rfIDCode)}>
						<p className='text-accent font-medium text-xl'>
							<span className='font-bold mr-2'>Account number:</span>
							{rfIDCode}
						</p>
						<p className='text-accent font-medium text-xl'>
							<span className='font-bold mr-2'>Wallet pin code:</span>
							{account}
						</p>
					</RenderIf>
				</div>
			</div>
			<LoaderSpinner load={loader} />
		</main>
	);
};

const PaymentBox = React.memo(PaymentDetails);

export default PaymentBox
