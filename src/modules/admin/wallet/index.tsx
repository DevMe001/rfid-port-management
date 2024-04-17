import React, { useCallback, useEffect, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import usePagination from '../../../utils/hooks/usePagination';
import { Ewallet } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import { useDeleteWalletAccountMutation, useGetEwalletAccountQuery, useGetFilterEwalletMutation } from '../../../api-query/wallet-api';
import PaginationRender from '../component/Pagination';
import { isEmpty } from 'lodash';
import { useLocation } from 'react-router-dom';

const AddNewWallet = ()=>{

	const [vehicleModal, setVehcile] = onVehicleModal();

		const onCloseModal = useCallback(() => {
			setVehcile(false);
			document.body.style.overflow = '';
		}, []);

	return (
		<RenderIf value={vehicleModal}>
			<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
				<div className='p-2'>
					Schedule form
			
				</div>
			</PopupModal>
		</RenderIf>
	);
}


const AddNewWalletRender = React.memo(AddNewWallet);



const Wallet: React.FC = () => {



const walletParams = useLocation();

let params = walletParams?.pathname.split('/')[3] ?? '';



	
	const header = ['Wallet id', 'User id', 'Account number', 'balance', 'Action'];

	const { data: walletRecord } = useGetEwalletAccountQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<Ewallet>(walletRecord as unknown as Ewallet[], 10);


	const [getFilterEwallet] = useGetFilterEwalletMutation();



	const getWalletById = useCallback(async () => {
		const res = await getFilterEwallet(params);
		if ('data' in res) {
			console.log(res.data);

			setData(res.data.data as unknown as Ewallet[]);
		}
	}, [getFilterEwallet, params, setData]);

	useEffect(() => {
		function init() {
			if (!isEmpty(params)) {
				getWalletById();
			}
		}

		init();
	}, [params, getWalletById]);










const [deleteWalletAccount] = useDeleteWalletAccountMutation();

	const onDeleteWallet = async (id: string) => {
		console.log(id);
const res =	await deleteWalletAccount(id);
		console.log(res)
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.wallet_id),
		<a href={`/admin-dashboard/personal/${row.personal_id}`}>{row.personal_id}</a>, 
		String(row.account_number),
		<span>&#8369; {String(row.balance)}</span>,
		<KebabMenu
			list={[
				{  label: 'View'}  ,
				{  label: 'Edit'}  ,
				{  label: 'Delete',onClick:()=> onDeleteWallet(row.wallet_id)}
			]}
		/>,
	]);

	const [filter, setFilter] = useState<string>('');
	const [vehicleModal, setVehcile] = onVehicleModal();

	const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFilter(value);
	}, 200);

	const onSubmitHandler = async () => {
		// const filterQuery: any = await filterRfidQuery(filter);
		// setData(filterQuery.data.data);

		console.log(filter);
	};

	// handle for add vehile icon
	const onAddVehicleToggle = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setVehcile(!vehicleModal);
	}, []);

	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Wallet' activeLink='Account' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onAddVehicleToggle} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<AddNewWalletRender />
		</>
	);
};

export default withAdminWrapper(Wallet);
