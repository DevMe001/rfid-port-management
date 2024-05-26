import React, { useCallback, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import {useDeleteVehicleMutation } from '../../../api-query/vehicle-api';
import usePagination from '../../../utils/hooks/usePagination';
import { Passenger as PassengerType } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import KebabMenu from '../component/KebabDropdown';
import { useDeletePassengerByIdMutation, useGetAllPassengerItemQuery } from '../../../api-query/passengerapi-service';
import PaginationRender from '../component/Pagination';





const Passengers: React.FC = () => {
	const header = ['Id','passenger name', 'Seat number','age','fare type','Booking amount', 'Action'];

	const { data: passengerRecord } = useGetAllPassengerItemQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<PassengerType>(passengerRecord as unknown as PassengerType[], 10);

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

	const [deletePassengerById] = useDeletePassengerByIdMutation();

	const onDeletPassenger = async (id: string) => {
		console.log(id);
		await deletePassengerById(id);
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.passenger_id),
		<span>
			{row.firstname}
			&nbsp;
			{row.lastname}
		</span>,
		<span>{row.seatNumber}</span>,
		<span>{row.age}</span>,
		<span>{row.fare_type}</span>,
		<span>₱ {row.booking_amount}</span>,
		<KebabMenu list={[{ label: 'Delete', onClick: () => onDeletPassenger(row?.passenger_id as string) }]} />,
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
				<Breadcrumbs group='Booking' activeLink='Passengers' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />
					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onAddVehicleToggle} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
		</>
	);
};

export default withAdminWrapper(Passengers);
