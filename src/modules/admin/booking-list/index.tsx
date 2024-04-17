import React, { useCallback, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import {useDeleteVehicleMutation } from '../../../api-query/vehicle-api';
import usePagination from '../../../utils/hooks/usePagination';
import { Booking } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import KebabMenu from '../component/KebabDropdown';
import { useGetBookignScheduleQuery } from '../../../api-query/bookingapi-service';
import PaginationRender from '../component/Pagination';





const BookingSchedule: React.FC = () => {
	const header = ['Booking Id','Passenger id','Schedule Id', 'Wallet Id','Amount','Status', 'Action'];

	const { data: bookingRecord } = useGetBookignScheduleQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<Booking>(bookingRecord as unknown as Booking[], 10);

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

	const onDeleteBooking = async (id: string) => {
		console.log(id);
		await deleteVehicle(id);
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.book_id),
		 <span>{row.passengers}</span>,
		  <a href={`/admin-dashboard/schedule/${row.schedule_id}`}>{row.schedule_id}</a>, 
		 <a href={`/admin-dashboard/ewallet/${row.wallet_id}`}>{row.wallet_id}</a>, 
			<span>&#8369; {row.amount}</span>,
			<span>{row.status}</span>,
			 <KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteBooking(row?.book_id as string) }]} />]);

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
				<Breadcrumbs group='Booking' activeLink='Record' />
				<div className='mt-10  w-[95%] lg:w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />
				</div>
			</div>
		</>
	);
};

export default withAdminWrapper(BookingSchedule);
