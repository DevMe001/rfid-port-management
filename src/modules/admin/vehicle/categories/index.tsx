import React, { useCallback, useState } from 'react';
import { VehicleType, Vehicles } from '../../../../api-query/types';
import { useGetVehicleRecordQuery, useDeleteVehicleMutation } from '../../../../api-query/vehicle-api';
import CustomButton from '../../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../../common/components/ui/main.ui.component';
import RenderIf from '../../../../common/components/ui/render-if';
import PopupModal from '../../../../common/widget/modal/popup.,modal';
import { onVehicleModal } from '../../../../utils/hooks/globa.state';
import useDebounceRef from '../../../../utils/hooks/useDebounce';
import usePagination from '../../../../utils/hooks/usePagination';
import Breadcrumbs from '../../component/Breadcrumbs';
import SearchInput from '../../component/Search';
import TableRender from '../../component/Table';
import withAdminWrapper from '../../component/admin-wrapper';
import { useDeleteVehicleByIdMutation, useGetVehicleTypesQuery } from '../../../../api-query/vehiclescategory-services';
import KebabMenu from '../../component/KebabDropdown';
import PaginationRender from '../../component/Pagination';


const AddNewVehicle = () => {
	const [vehicleModal, setVehcile] = onVehicleModal();

	const onCloseModal = useCallback(() => {
		setVehcile(false);
		document.body.style.overflow = '';
	}, []);

	return (
		<RenderIf value={vehicleModal}>
			<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
				<div className='p-2'>Vehicle form</div>
			</PopupModal>
		</RenderIf>
	);
};

const AddVehicleRender = React.memo(AddNewVehicle);

const VehicleTypeCategories: React.FC = () => {
	const header = ['ID', 'vehicle name', 'carrier fee',  'Action'];

	const { data: vehicleRecord } = useGetVehicleTypesQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<VehicleType>(vehicleRecord as unknown as VehicleType[], 10);

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

	const [deleteVehicleById] = useDeleteVehicleByIdMutation();

	const onDeleteVehicleCategories = async (id: string) => {
		console.log(id);
		await deleteVehicleById(id);
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.vehicletype_id),
		String(row.vehicletype_name),
		<span>&#8369; {String(row.carrier_fee)}</span>,
	<KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteVehicleCategories(row.vehicletype_id) }]} />,
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
				<Breadcrumbs group='Schedule' activeLink='Vehicle category' />
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
};

export default withAdminWrapper(VehicleTypeCategories);
