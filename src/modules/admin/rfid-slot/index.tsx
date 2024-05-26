import React, { useCallback, useEffect, useRef, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import { isEmpty, isNull } from 'lodash';
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



const AddNewRFIDScanner:React.FC = ()=>{

	const [scan,setScan] = useState<string>('');
	const [scanning,setScanning] = useState<boolean>(false);
		const [rfidModal, setRfidModal] = onRfidModal();

	const inputRef = useRef<HTMLInputElement>(null);

	
	const [newRFIDSlot] = useNewRFIDSlotMutation();

	


	const handleEnableFocus = () => {
		if (inputRef.current) {
			inputRef.current.removeAttribute('tabindex'); // Remove tabindex attribute
			inputRef.current.onfocus = null; // Remove the custom onFocus handler
		}
	};




	let valueArr: string[] = [];


	const [getFinalValue, setFinalValue] = useState('');
	const [getVal,setVal] = useState(false);

const handleScannerDevice = useCallback(
	async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		valueArr.push(value);
		setScanning(true);
		await waitSec(2000);
		setScanning(false);

		if (!isEmpty(value)) {
			const valueRec = valueArr.join('');


			if (!isEmpty(valueRec)) {
					setFinalValue(valueRec);
					setVal(true);
			}

			setRfidModal(false);
			setScan('');

			// Reset the value array
			valueArr = [];
		}
	},
	[setScan],
);

useEffect(()=>{

	async function getFetch(){
			if (!isEmpty(getFinalValue) && getVal) {
				 await newRFIDSlot({ rfid_number: getFinalValue });
				setVal(false);
			}

	}

	getFetch();

},[getFinalValue])


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
					<p className='p-2 my-2 text-center font-medium'>{!isEmpty(scan) && !scanning ? 'Your RFID Number:' : !isEmpty(scan) && scanning ? 'Checking....' : 'Scan now'}</p>
					<p className='text-navy text-center text-xl my-2 break-words'>
						{scan} 
					</p>

					<div className='flex justify-center items-center'>
						<div
							className={clsx({
								'rfid-scanner': scanning,
							})}
						>
							<img src={RFID} alt='rfid' />
						</div>
					</div>
					<input ref={inputRef} value={scan} type='text' className='visually-hidden' onChange={handleScannerDevice} autoFocus={true} />
				</div>
			</PopupModal>
		</RenderIf>
	);
}

export const OptimizeAddRfid = React.memo(AddNewRFIDScanner);





const RFIDSlot:React.FC = () => {
	const header = ['ID', 'RFID Number', 'Action']; // Define table headers


	const { data: getRFIDSlot } = useGetRfidSlotAvailableQuery(undefined,{ pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
const [deleteRfIdSlot] = useDeleteRfIdSlotMutation();

	const onDeleteRfid = async(id:string)=>{
		 await deleteRfIdSlot(id);
	}




	const [, setRfidModal] = onRfidModal();

	


const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<RFIDSlotDto>(getRFIDSlot, 10);



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

	
	const body: (string | JSX.Element)[][] = paginatedData?.map((row: RFIDSlotDto) => [
		String(row.rfid_id),
		String(row.rfid_number),
		<KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteRfid(row?.rfid_id as string) }]} />,
	]);





	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Booking' activeLink='RFID slot' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-start lg:justify-end pr-5 -mt-5 lg:mt-10'>
						<CustomButton onClick={onRFIdHandler} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<OptimizeAddRfid />
		</>
	);
}

const RFIDOptimizeSlot = React.memo(RFIDSlot);

export default withAdminWrapper(RFIDOptimizeSlot);
