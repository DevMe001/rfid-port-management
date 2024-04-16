import React, { useCallback, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import {useDeleteVehicleMutation, useGetVehicleRecordQuery } from '../../../api-query/vehicle-api';
import usePagination from '../../../utils/hooks/usePagination';
import { Account, Vehicles } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import { useGetAccountsQuery } from '../../../api-query/account-api';
import { isEmpty } from 'lodash';
import PaginationRender from '../component/Pagination';


const AddNewVehicle = ()=>{

	const [vehicleModal, setVehcile] = onVehicleModal();

		const onCloseModal = useCallback(() => {
			setVehcile(false);
			document.body.style.overflow = '';
		}, []);

	return (
		<RenderIf value={vehicleModal}>
			<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
				<div className='p-2'>
					Vehicle form
			
				</div>
			</PopupModal>
		</RenderIf>
	);
}


const AddVehicleRender = React.memo(AddNewVehicle);



const UserControl:React.FC = () => {
	const header = ['ID', 'Username','Email','Photo', 'Action']; 

	const { data: userRecord } = useGetAccountsQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });




	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<Account>(userRecord as unknown as Account[], 5);



  // const data = [
	// 	{
	// 		id: 1,
	// 		name: 'Leanne Graham',
	// 		username: 'Bret',
	// 		email: 'Sincere@april.biz',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Ervin Howell',
	// 		username: 'Antonette',
	// 		email: 'Shanna@melissa.tv',
	// 	},
	// ];

	const [deleteVehicle] = useDeleteVehicleMutation();

	const onDeleteVehicle = async (id: string) => {

		console.log(id);
		 await deleteVehicle(id);
	};




	
  
	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		<span>{row.user_id}</span>,
		<span>{row.displayName}</span>,
		<span>{row.email}</span>,
			<img src={!isEmpty(row.photo) ? `http://localhost:8000/account/photo/${row.user_id}` : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'} className='w-[50px] h-[50px]' />,

	<KebabMenu
			list={[
				{  label: 'View'}  ,
				{  label: 'Edit'}  ,
				{  label: 'Delete',onClick:()=> onDeleteVehicle(row.account_id as string)}
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
				<Breadcrumbs group='Setting' activeLink='Users' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onAddVehicleToggle} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<AddVehicleRender />
		</>
	);
}

export default withAdminWrapper(UserControl);
