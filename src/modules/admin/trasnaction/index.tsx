import React, { useCallback, useRef, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
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

import usePagination from '../../../utils/hooks/usePagination';
import TableRender from '../component/Table';
import PaginationRender from '../component/Pagination';
import SearchInput from '../component/Search';
import Breadcrumbs from '../component/Breadcrumbs';
import KebabMenu from '../component/KebabDropdown';
import {  PaymentTransactionType, useDeleteTransactionMutation, useGetTransactionListQuery } from '../../../api-query/transaction.api.services';




const Transaction: React.FC = () => {
	const header = ['ID', 'Book id', 'Wallet id',  'Payment id', 'Action']; // Define table headers

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
		setData(filterQuery.data.data);
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row: PaymentTransactionType) => [
		String(row.transaction_id),
		 String(row.book_id), 
		 String(row.wallet_id), 
		 String(row.payment_id),
		  <KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeletePaymentTrasnction(row?.payment_id as string) }]} />]);

	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Wallet' activeLink='Transaction' />

				<div className='mt-10 w-[90%] mx-auto'>
					<h3 className='font-medium text-xl mb-2'>Transaction Record</h3>
					<hr></hr>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

				
				</div>
			</div>
	s
		</>
	);
};

const PaymentTransaction = React.memo(Transaction);

export default withAdminWrapper(PaymentTransaction);
