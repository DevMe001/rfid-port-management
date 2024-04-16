import React, { useCallback, useEffect, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import usePagination from '../../../utils/hooks/usePagination';
import { Schedules as ScheduleTypes } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import { ScheduleReturnMutation, useDeleteScheduleByIdMutation, useGetBookingScheduleAdminQuery, useGetFilterScheduleMutation } from '../../../api-query/schedule-list.api';
import PaginationRender from '../component/Pagination';
import { useLocation } from 'react-router-dom';
import {  isEmpty } from 'lodash';


const AddNewSchedule = ()=>{

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


const AddNewScheduleRender = React.memo(AddNewSchedule);



const Schedules: React.FC = () => {



const scheduleParams = useLocation();

let params = scheduleParams?.pathname.split('/')[3] ?? '';


console.log(params, 'get params');

	const header = ['ID', 'Vehicle photo', 'Origin', 'Destination','Arrival date', 'Action'];

	const { data: scheduleRecord } = useGetBookingScheduleAdminQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });




	const [getFilterSchedule] = useGetFilterScheduleMutation();




	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<ScheduleTypes>(scheduleRecord as unknown as ScheduleTypes[], 10);




	const getScheduleById = useCallback(async () => {
		const res = await getFilterSchedule(params);
		if ('data' in res) {
			console.log(res.data);

			setData(res.data.data as unknown as ScheduleTypes[]);
		}
	}, [getFilterSchedule, params, setData]);

	useEffect(() => {
		function init() {
			if (!isEmpty(params)) {
				getScheduleById();
			}
		}

		init();
	}, [params, getScheduleById]);





	const [deleteScheduleById] = useDeleteScheduleByIdMutation();

	const onDeleteSchedule = async (id: string) => {
		console.log(id);
		await deleteScheduleById(id);
	};


	

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.schedule_id),
		<a href='#'>
			<img src={`http://localhost:8000/vehicle?photo=${row.vehicle.vehicle_id}`} className='w-[50px] h-[50px]' />
		</a>,
		String(row.origin),
		String(row.destination),
		String(row.arrival_date),
		<KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteSchedule(row.schedule_id) }]} />,
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
				<Breadcrumbs group='Schedule' activeLink='Record' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onAddVehicleToggle} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<AddNewScheduleRender />
		</>
	);
};

export default withAdminWrapper(Schedules);
