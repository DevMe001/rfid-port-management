import React, { useCallback, useRef, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import { Table, TextInput } from 'flowbite-react';
import { isEmpty } from 'lodash';
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
import { FaSearch } from 'react-icons/fa';
import usePagination from '../../../utils/hooks/usePagination';

type TableProps = {
	header: string[];
	body: (string | JSX.Element)[][];
};

const TableRender: React.FC<TableProps> = ({ header, body }) => {
	return (
		<Table striped hoverable>
			<Table.Head>{!isEmpty(header) && header.map((head, index) => <Table.HeadCell key={index}>{head}</Table.HeadCell>)}</Table.Head>
			<Table.Body className='divide-y'>
				{!isEmpty(body) ? (
					body.map((row, rowIndex) => (
						<Table.Row key={rowIndex} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
							{row.map((cellContent, cellIndex) => (
								<Table.Cell key={cellIndex} className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
									{typeof cellContent === 'string' ? (
										cellContent // If cellContent is already a string, render it as is
									) : (
										<>{cellContent}</> // If cellContent is JSX.Element, render it
									)}
								</Table.Cell>
							))}
						</Table.Row>
					))
				) : (
					<Table.Row>
						<Table.Cell className='text-center' colSpan={header.length}>
							<p className='text-warning font-medium text-sm'> No data available</p>
						</Table.Cell>
					</Table.Row>
				)}
			</Table.Body>
		</Table>
	);
};


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


let counter = 0;

const handleScannerDevice = useCallback(
	async (e: React.ChangeEvent<HTMLInputElement>) => {
		counter = 1;
		const value = e.target.value;
		setScanning(true);
		setScan(value);
		await waitSec(2000);

		if (!isEmpty(value)) {
		
			try {
				if (counter === 1) {
					const data = { rfid_number: e.target.value };

					const res: any = await newRFIDSlot(data);

					if ('data' in res) {
						const message = res.data?.message as string;
						const variant = message === 'existed' ? 'error' : 'success';

					showNotification(message, variant);
					}
				}
			} catch (error) {
				console.error('Error:', error);
			} finally {
				setScanning(false);
				setRfidModal(false);
				setScan('');
				counter = 0;
			}
		}
	},
	[],
);

	const showNotification = useCallback(
		(message: string, variant: 'error' | "default" | "success" | "warning" | "info") => {
			enqueueSnackbar(message, { variant, autoHideDuration: 3000 });
		},
		[enqueueSnackbar],
	);

		const onCloseRfid = useCallback(() => {
				setRfidModal(false);
			document.body.style.overflow = '';
		
		}, []);

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

const OptimizeAddRfid = React.memo(AddNewRFIDScanner);


type Pagination = {
	prev: () => void;
	currentPage: number;
	totalPage: number;
	next: () => void;
};


const RFIDPagination: React.FC<Pagination> = ({ prev, currentPage, totalPage,next }) => {
	return (
		<div className='w-full'>
			<div className='flex justify-end pr-5 mt-5  shadow-sm'>
				<div className='bg-white w-auto py-1 px-2 flex justify-between gap-3'>
					<span className='font-medium cursor-pointer text-navy' onClick={prev}>
						Prev
					</span>
					<span>|</span>
					<span className='text-navy'>
						<p className='text-center'>
							Page {currentPage} / Page {totalPage}
						</p>
					</span>
					<span>|</span>
					<span className='font-medium cursor-pointer text-navy' onClick={next}>
						Next
					</span>
				</div>
			</div>
		</div>
	);
};


const RFIDSlot:React.FC = () => {
	const header = ['ID', 'RFID Number', 'Action']; // Define table headers


	const { data: getRFIDSlot } = useGetRfidSlotAvailableQuery(undefined,{ pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
const [deleteRfIdSlot] = useDeleteRfIdSlotMutation();

	const onDeleteRfid = async(id:string)=>{
			const res = await deleteRfIdSlot(id);
			console.log(res);
	}




	const [rfidModal, setRfidModal] = onRfidModal();

	


const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<RFIDSlotDto>(getRFIDSlot, 10);



	const [filterRfidQuery] = useFilterRfidQueryMutation();

	const onRFIdHandler = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setRfidModal(!rfidModal);
	}, []);


	const [filter,setFilter] = useState<string>('');
	
const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	setFilter(value);
	console.log(value);
}, 200);


	const onSubmitHandler = async () => {
		const filterQuery:any = await filterRfidQuery(filter);
		setData(filterQuery.data.data);
	};

	
	const body: (string | JSX.Element)[][] = paginatedData?.map((row: RFIDSlotDto) => [
		String(row.rfid_id),
		String(row.rfid_number),
		<a onClick={() => onDeleteRfid(row?.rfid_id as string)} className='cursor-pointer'>
			Delete
		</a>,
	]);





	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<div className='mt-10 w-[90%] mx-auto'>
					<div className='flex justify-end items-center pr-5 pb-2 gap-2 my-5'>
						<TextInput type='search' placeholder='Search' className='rounded !outline-none !border-none' onChange={onFilterQuery} />
						<CustomButton
							onClick={onSubmitHandler}
							label={
								<p className='flex justify-center items-center gap-2'>
									Search
									<FaSearch />
								</p>
							}
						/>
					</div>
					<TableRender header={header} body={body} />
					<RFIDPagination prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
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
