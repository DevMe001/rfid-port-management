import React, { useCallback, useRef, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import { isEmpty, startCase } from 'lodash';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import CustomButton from '../../../common/components/ui/button.componetnt';
import RFID from '.././../../assets/dashboard/rfid_scanner.svg'
import './styles/rfid.css';
import clsx from 'clsx';
import { onRfidModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import { useDeleteRfIdSlotMutation, useFilterRfidQueryMutation, useGetRfidSlotAvailableQuery, useNewRFIDSlotMutation } from '../../../api-query/rfid-api';
import { RFIDSlotDto } from '../../../api-query/types';
import { enqueueSnackbar } from 'notistack';
import waitSec from '../../../utils/setTimeout';
import useDebounceRef from '../../../utils/hooks/useDebounce';

import usePagination from '../../../utils/hooks/usePagination';
import TableRender from '../component/Table';
import PaginationRender from '../component/Pagination';
import SearchInput from '../component/Search';
import Breadcrumbs from '../component/Breadcrumbs';
import KebabMenu from '../component/KebabDropdown';
import { PaymentHistory, useDeleteTransactionMutation, useGetPaymentHistoryQuery, usePostTransactionMutation } from '../../../api-query/transaction.api.services';




const AddNewRFIDScanner: React.FC = () => {
	const [scan, setScan] = useState<string>('');
	const [scanning, setScanning] = useState<boolean>(false);
	const [rfidModal, setRfidModal] = onRfidModal();

	const inputRef = useRef<HTMLInputElement>(null);

	const [postTransaction] = usePostTransactionMutation();

	const handleEnableFocus = () => {
		if (inputRef.current) {
			inputRef.current.removeAttribute('tabindex'); // Remove tabindex attribute
			inputRef.current.onfocus = null; // Remove the custom onFocus handler
		}
	};


const [message, setMessage] = useState<string>('');

let counter = 1;

let valueArr:string[] = [];

const handleScannerDevice = useCallback(
	async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setScanning(true);

		valueArr.push(value);

		await waitSec(2000);
		setScanning(false);

		if (!isEmpty(value)) {
		
			if (counter === 1) {
				onResponse();
				counter = 0;
			}
		}
	},
	[], // Include setValueArr in the dependency array
);


const onResponse = useCallback(async () => {
	const data = { account_number: valueArr.join('') };

	console.log(data);

	const res: any = await postTransaction(data);

	console.log(res.data.message);
	setMessage(res.data.message as string);

	setScan('');
	valueArr = [];
	await waitSec(2000);
	setMessage('');
	onCloseRfid();
}, []);

	// const showNotification = useCallback(
	// 	(message: string, variant: 'error' | "default" | "success" | "warning" | "info") => {
	// 		enqueueSnackbar(message, { variant, autoHideDuration: 3000 });
	// 	},
	// 	[enqueueSnackbar],
	// );

	const onCloseRfid = useCallback(() => {
		setRfidModal(false);
		document.body.style.overflow = '';
	}, [setRfidModal]);

	return (
		<RenderIf value={rfidModal}>
			<PopupModal maxWidth='max-w-full' onClose={onCloseRfid}>
				<div className='p-2' onMouseEnter={handleEnableFocus}>
					<RenderIf value={message !== ''}>
						<p className={clsx('p-2 my-2 text-center font-medium text-red-500',{
							'text-accent': message.includes('completed')
						})}>{startCase(message)}</p>
					</RenderIf>
					<RenderIf value={message == ''}>
						<p className='p-2 my-2 text-center font-medium'>{!isEmpty(scan) && !scanning ? 'Your RFID Number:' : !isEmpty(scan) && scanning ? 'Checking....' : 'Scan now'}</p>
					</RenderIf>

					<p className='text-navy text-center text-xl my-2 break-words'>{scan}</p>

					<label htmlFor='scanner'>
						<div className='relative flex justify-center items-center cursor-text'>
							<div
								className={clsx({
									'rfid-scanner': scanning,
								})}
							>
								<img src={RFID} alt='rfid' />
							</div>
						</div>
					</label>
					<input id='scanner' ref={inputRef} value={scan} type='text' className='visually-hidden' onChange={handleScannerDevice} autoFocus={true} />
				</div>
			</PopupModal>
		</RenderIf>
	);
};

export const OptimizeAddRfid = React.memo(AddNewRFIDScanner);




const DockPayment:React.FC = () => {
	const header = ['Payment ID', 'wallet balance', 'booking amount','current balance','Action']; // Define table headers


	const { data: getPaymentHistory } = useGetPaymentHistoryQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
const [deleteTransaction] = useDeleteTransactionMutation();

	const onDeletePaymentHistory = async (id: string) => {
		await deleteTransaction(id);
	};




	const [, setRfidModal] = onRfidModal();

	


const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<PaymentHistory>(getPaymentHistory as unknown as PaymentHistory[], 10);



	const [filterRfidQuery] = useFilterRfidQueryMutation();

	const onRFIdHandler = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setRfidModal(true);
	}, []);


	const [filter,setFilter] = useState<string>('');
	
const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	setFilter(value);
}, 200);


	const onSubmitHandler = async () => {
		const filterQuery:any = await filterRfidQuery(filter);
		setData(filterQuery.data.data);
	};

	
	const body: (string | JSX.Element)[][] = paginatedData?.map((row: PaymentHistory) => [
		String(row.payment_id), 
		String(row.wallet_balance), 
		String(row.booking_amount), 
		String(row.current_balance), 
		 <KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeletePaymentHistory(row?.payment_id as string) }]} />]);





	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Wallet' activeLink='Dock payment' />

				<div className='mt-10 w-[90%] mx-auto'>
					<h3 className='font-medium text-xl mb-2'>Payment history</h3>
					<hr></hr>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onRFIdHandler} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<OptimizeAddRfid />
		</>
	);
}

const PaymentRecordHistory = React.memo(DockPayment);

export default withAdminWrapper(PaymentRecordHistory);
