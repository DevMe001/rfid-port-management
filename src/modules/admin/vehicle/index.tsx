import React, { useCallback, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import {useDeleteVehicleMutation, useGetVehicleRecordQuery } from '../../../api-query/vehicle-api';
import usePagination from '../../../utils/hooks/usePagination';
import { Vehicles } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
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



const Vehicle:React.FC = () => {
	const header = ['ID', 'Photo','Name','Type','Price', 'Action']; 

	const { data: vehicleRecord } = useGetVehicleRecordQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });




	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<Vehicles>(vehicleRecord as unknown as Vehicles[], 10);



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
		String(row.vehicle_id),
		<img src={`http://localhost:8000/vehicle?photo=${row.vehicle_id}`} className='w-[50px] h-[50px]' />,
		String(row.vehicle_name),
		String(row.vehicle_type),
		String(row.vehicle_price),
		<KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteVehicle(row?.vehicle_id as string) }]} />,

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
				<Breadcrumbs group='Schedule' activeLink='Vehicle' />
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

export default withAdminWrapper(Vehicle);
