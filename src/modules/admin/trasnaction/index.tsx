import React, { useCallback, useEffect, useRef, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import { isEmpty } from 'lodash';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import CustomButton from '../../../common/components/ui/button.componetnt';
import RFID from '.././../../assets/dashboard/rfid_scanner.svg'
import './styles/rfid.css';
import clsx from 'clsx';
import { getStartEndDateObject, onRfidModal } from '../../../utils/hooks/globa.state';
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
import {  PaymentTransactionType, QueryResultTypeTransaction, TransactionPaymentRecord, useDeleteTransactionMutation, useGetTransactionListQuery } from '../../../api-query/transaction.api.services';
import { useNavigate } from 'react-router-dom';
import { GrPrint } from 'react-icons/gr';
import usePrintFunc from '../../../utils/hooks/usePrintFunc';
import PrintAllInvoiceDetails from './invoice-all';
import { TbFilterSearch } from 'react-icons/tb';
import InputFieldFormInput from '../../../common/components/ui/input-form';
import InvoiceFilterByDate from './invoice-filter';



const Transaction: React.FC = () => {
	const header = ['Transaction ID', 'Book ID', 'Wallet ID', 'Action']; // Define table headers

	const { data: getTransaction } = useGetTransactionListQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
	const [deleteTransaction] = useDeleteTransactionMutation();

	const onDeletePaymentTrasnction = async (id: string) => {
		await deleteTransaction(id);
	};

	const [rfidModal, setRfidModal] = onRfidModal();

	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<PaymentTransactionType>(getTransaction as unknown as PaymentTransactionType[], 10);

	const [filterRfidQuery] = useFilterRfidQueryMutation();

	const onRFIdHandler = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setRfidModal(!rfidModal);
	}, []);

	const [filter, setFilter] = useState<string>('');

	const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFilter(value);
	}, 200);

	const onSubmitHandler = async () => {
		const filterQuery: any = await filterRfidQuery(filter);
			if (!isEmpty(filter)) {
				setData(filterQuery.data.data);
			}
	};


	const navigate = useNavigate();

	const onViewTransactionDetails = (id:string) =>{
		navigate(`/admin-dashboard/transaction/${id}`);
	}

	const body: (string | JSX.Element)[][] = paginatedData?.map((row: PaymentTransactionType) => [
		String(row.transaction_id),
		 String(row.book_id), 
		 String(row.wallet_id), 
		  <KebabMenu list={[{ label: 'View', onClick: () => onViewTransactionDetails(row?.transaction_id as string) }, { label: 'Delete', onClick: () => onDeletePaymentTrasnction(row?.payment_id as string) }]} />]);



const { componentRef, handlePrint } = usePrintFunc();

const [onFilterDate,setFilterDate] = useState<boolean>(false);


	const [getFilterTransaction, setFilterDataByDate] = useState<Partial<QueryResultTypeTransaction>>();

	console.log(getFilterTransaction,'get filtered');


const onFilterModal =()=>{
			setFilterDate(true);
}
const onFilterModalClose =()=>{
			setFilterDate(false);
}

	const [date] = getStartEndDateObject();



	useEffect(() => {
		if (!isEmpty(date.startDate) && !isEmpty(date.endDate)) {
			handlePrint();
		}
	}, [date]);


	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Wallet' activeLink='Transaction' />

				<div className='mt-10 w-[90%] mx-auto'>
					<div className='flex justify-between mb-5'>
						<h3 className='font-medium text-xl mb-2'>Transaction Record</h3>

						<div className='self-end'>
							<CustomButton
								css={{ background: '#ffffff', color: '#D15331', fontWeight: 700 }}
								onClick={onFilterModal}
								label={
									<p className='flex gap-2 items-center '>
										<TbFilterSearch />
									</p>
								}
							/>
							&nbsp;&nbsp;
							<CustomButton
								onClick={handlePrint}
								label={
									<p className='flex gap-2 items-center'>
										<GrPrint />
									</p>
								}
							/>
						</div>
					</div>
					<hr></hr>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />
				</div>
			</div>
			<RenderIf value={!isEmpty(getTransaction)}>
				<PrintAllInvoiceDetails componentRef={componentRef} data={getTransaction as QueryResultTypeTransaction} />
			</RenderIf>

			<RenderIf value={onFilterDate}>
				<PopupModal maxWidth='w-screen' onClose={onFilterModalClose}>
					<InvoiceFilterByDate  setFilterDataByDate={setFilterDataByDate} />
				</PopupModal>
			</RenderIf>

			<RenderIf value={!isEmpty(getFilterTransaction)}>
				<PrintAllInvoiceDetails componentRef={componentRef} data={getFilterTransaction as QueryResultTypeTransaction} />
			</RenderIf>
		</>
	);
};

const PaymentTransaction = React.memo(Transaction);

export default withAdminWrapper(PaymentTransaction);
