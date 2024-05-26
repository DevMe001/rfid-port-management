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
import { getScheduleRenderRow, onPopupModal, onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import { useDeleteScheduleByIdMutation, useGetBookingScheduleAdminQuery, useGetFilterScheduleMutation, useNewScheduleMutation, useUpdateScheduleMutation } from '../../../api-query/schedule-list.api';
import PaginationRender from '../component/Pagination';
import { useLocation } from 'react-router-dom';
import {  isEmpty, startCase } from 'lodash';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldProps, Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { Button, TextInput } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';
import { VehicleIds, useGetVehicleIdListQuery } from '../../../api-query/vehicle-api';

import moment from 'moment';

interface FormData {
	origin: string;
	destination?: string;
	seatRange?:string;
	arrival_date:string | Date;
	arrival_time:string;
	vehicle_id?:string;
}

const formSchema = Yup.object().shape({
	origin: Yup.string().required('Field is required'),
	destination: Yup.string().required('Field is required'),
	seatRange: Yup.string(),
	arrival_date: Yup.string(),
	arrival_time: Yup.string(),
	vehicle_id: Yup.string().required('Field is required'),
});




type ActionFormData = {
	action: string;
	row?: Partial<FormData & { schedule_id?: string }>;
};


const ScheduleRender: React.FC<ActionFormData> = ({row,action}) => {
	const [scheduleModal, setSchedule] = onPopupModal();

	const { data: vehicleIds } = useGetVehicleIdListQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const vehiceList = !isEmpty(vehicleIds) ? (vehicleIds as unknown as VehicleIds[]) : [];

	const [newSchedule] = useNewScheduleMutation();
	const [updateSchedule] = useUpdateScheduleMutation();

	

	const onCloseModal = useCallback(() => {
		setSchedule(false);
		document.body.style.overflow = '';
	}, []);

	const handleSubmitRequest = async (values: FormData, actions: FormikHelpers<FormData>) => {
		const converted12 = moment(values.arrival_time, 'HH:mm').format('h:mm A');

	



		if(action === 'edit'){

				const details = {
					...values,
					arrival_time: converted12,
					schedule_id:row?.schedule_id
				};


			const res = await updateSchedule(details);

			console.log(res);

			setSchedule(false);

			actions.resetForm();

		}else{

				const newData = {
					...values,
					arrival_time: converted12,
				};

					const res = await newSchedule(newData);

					console.log(res);

					setSchedule(false);

					actions.resetForm();
		}


	};

	

	const onArrivalDate = (e: React.FormEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>, formikProps: FormikProps<FormData>) => {
		let value = '';

		if ('currentTarget' in e) {
			value = (e.currentTarget as HTMLInputElement).value;
		}

		formikProps.setFieldValue(`arrival_date`, value);
	};

	const onArrivalTime = (e: React.FormEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>, formikProps: FormikProps<FormData>) => {
		let value = '';

		if ('currentTarget' in e) {
			value = (e.currentTarget as HTMLInputElement).value;
		}

		formikProps.setFieldValue(`arrival_time`, value);
	};


const parsedTime = moment(row?.arrival_time, 'h:mm A');


const formattedTime = parsedTime.format('HH:mm');



	const initialValues: FormData = {
		origin: row?.origin ?? '',
		destination: row?.destination ?? '',
		seatRange: row?.seatRange ?? '',
		vehicle_id: row?.vehicle_id ?? '',
		arrival_date: moment(row?.arrival_date ?? '').format('YYYY-MM-DD'),
		arrival_time: formattedTime ?? '',
	};

	return (
		<Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={handleSubmitRequest} enableReinitialize={true}>
			<RenderIf value={scheduleModal}>
				<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
					<div className='w-[20rem]'>
						<Form className='flex flex-col gap-4 w-full'>
							<div>
								<label htmlFor='origin' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Origin
								</label>
								<Field name='origin'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='' />}</Field>

								<ErrorMessage
									name='origin'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='destination' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Destination
								</label>
								<Field name='destination'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='' />}</Field>

								<ErrorMessage
									name='destination'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='arrival_date' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Arrival date
								</label>
								<Field name='arrival_date'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' style={{ maxWidth: '100%' }} id='arrival_date' type='date' onChange={(e) => onArrivalDate(e, fieldProps.form)} placeholder='' />}</Field>

								<ErrorMessage
									name='arrival_date'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='arrival_time' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Arrival time
								</label>
								<Field name='arrival_time'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' style={{ maxWidth: '100%' }} id='arrival_time' type='time' onChange={(e) => onArrivalTime(e, fieldProps.form)} placeholder='' />}</Field>

								<ErrorMessage
									name='arrival_time'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='vehicle_id' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Vehicle List
								</label>
								<Field name='vehicle_id'>
									{(fieldProps: FieldProps) => (
										<select {...fieldProps.field} id='vehicle_id' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
											<option value=''>Select type</option>
											{!isEmpty(vehicleIds) && vehiceList?.map((item) => <option value={item.vehicle_id}>{startCase(item.vehicle_name)}</option>)}
										</select>
									)}
								</Field>
								<ErrorMessage
									name='vehicle_type'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
								<div className='flex justify-end items-center mt-5'>
									<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
										Save &nbsp; <FaSave />
									</Button>
								</div>
							</div>
						</Form>
					</div>
				</PopupModal>
			</RenderIf>
		</Formik>
	);
};







const Schedules: React.FC = () => {



const scheduleParams = useLocation();

let params = scheduleParams?.pathname.split('/')[3] ?? '';




	const header = ['ID', 'Vehicle photo', 'Origin', 'Destination','Arrival date','arrival time', 'Action'];

	const { data: scheduleRecord } = useGetBookingScheduleAdminQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });




	const [getFilterSchedule] = useGetFilterScheduleMutation();

	const [actionState, setAction] = useState<string>('add');


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




const [dataRow, setRow] = getScheduleRenderRow();

	
	

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		<div className='w-[11rem]'>
			<p className='overflow-hidden truncate w-4/12'>{String(row.schedule_id)}</p>
		</div>,
		<a href='#'>
			<img src={`http://localhost:8000/vehicle?photo=${row.vehicle.vehicle_id}`} className='w-[50px] h-[50px]' />
		</a>,
		String(row.origin),
		String(row.destination),
		String(moment(row.arrival_date).format('MMMM DD, YYYY')),
		String(row.arrival_time),
		<KebabMenu
			list={[
				{ label: 'Edit', onClick: () => onAddScheduleToggle('edit', row) },
				{ label: 'Delete', onClick: () => onDeleteSchedule(row.schedule_id) },
			]}
		/>,
	]);

	const [filter, setFilter] = useState<string>('');
	const [, setSched] = onPopupModal();

	const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFilter(value);
	}, 200);

	const onSubmitHandler = async () => {
		const filterQuery: any = await getFilterSchedule(filter);
		setData(filterQuery.data.data as unknown as ScheduleTypes[]);

	
	};

	// handle for add vehile icon

	
const onAddScheduleToggle = useCallback((action: string, row?: Partial<ScheduleTypes>) => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
	document.body.style.overflow = 'hidden';
	setSched(true);

	setAction(action);
	if (row) {
		// Reset the row state to an empty object before inserting new data
		setRow({}); // Reset to empty object

		// If a new row is provided, update the row state with the new value
		if (row) {
			setRow((prevRow) => ({
				...prevRow,
				...row,
			}));
		}
	}
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

					<div className='flex justify-start lg:justify-end pr-5 -mt-5 lg:mt-10'>
						<CustomButton onClick={() => onAddScheduleToggle('add')} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>

			<RenderIf value={actionState === 'edit'}>
				<ScheduleRender row={dataRow} action='edit' />
			</RenderIf>
			<RenderIf value={actionState === 'add'}>
				<ScheduleRender action='add' />
			</RenderIf>
		</>
	);
};

export default withAdminWrapper(Schedules);
