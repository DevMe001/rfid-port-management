import React, { useCallback, useState } from 'react'
import withAdminWrapper from '../component/admin-wrapper'
import CustomButton from '../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../common/components/ui/main.ui.component';
import TableRender from '../component/Table';
import Breadcrumbs from '../component/Breadcrumbs';
import {useDeleteVehicleMutation, useGetVehicleRecordQuery, useNewVehicleMutation } from '../../../api-query/vehicle-api';
import usePagination from '../../../utils/hooks/usePagination';
import { Vehicles } from '../../../api-query/types';
import useDebounceRef from '../../../utils/hooks/useDebounce';
import SearchInput from '../component/Search';
import { onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import PaginationRender from '../component/Pagination';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldProps, Formik, Form, useFormikContext } from 'formik';
import { Button, TextInput } from 'flowbite-react';
import { FaSave, FaRegUserCircle } from 'react-icons/fa';
import { isNull, isEmpty } from 'lodash';
import { FaRegImage } from 'react-icons/fa6';

interface FormData {
	vehicle_photo?: any;
	vehicle_name: string;
	vehicle_price: string;
	vehicle_type: 'open air' | 'air condition' | string;
}

const formSchema = Yup.object().shape({
	vehicle_photo: Yup.mixed(),
	vehicle_name: Yup.string().required('Field is required'),
	vehicle_price: Yup.string().required('Field is required'),
	vehicle_type: Yup.string().required('Field is required'),
});
const initialValues: FormData = {
	vehicle_name: '',
	vehicle_price: '',
	vehicle_type: '',
};


const AddNewVehicle = ()=>{
	const [vehicleModal, setVehcile] = onVehicleModal();

	const [preview, setPreview] = useState<string>('');

	const [newVehicle] = useNewVehicleMutation();

	const onCloseModal = useCallback(() => {
		setVehcile(false);
		document.body.style.overflow = '';
	}, []);

	const handleSubmitRequest = async (values: FormData) => {
		console.log(values);
	};


	const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isNull(e.target.files)) {
			try {
				let getFile = e.target.files[0] as File;
	
				const imageUrl = URL.createObjectURL(getFile);
				setPreview(imageUrl);
			
				
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={handleSubmitRequest}>
			<RenderIf value={vehicleModal}>
				<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
					<div className='w-[20rem]'>
						<Form className='flex flex-col gap-4 w-full'>
							<div>
								<div className='w-full py-4 flex flex-col items-center gap-2 mb-4'>
									<label htmlFor='photo' className='cursor-pointer'>
										<RenderIf value={!isEmpty(preview)}>
											<img className='object-cover  w-[6rem] h-[6rem]' src={preview} alt='Preview' />
										</RenderIf>
										<RenderIf value={isEmpty(preview)}>
											<div className='shadow-md p-2 rounded-full w-[8rem] h-[8rem] flex justify-center items-center'>
												<FaRegImage size={40} />
											</div>
										</RenderIf>
									</label>
									<p className='font-medium'>Upload vehicle photo</p>
									<div className='block'>
										<Field name='vehicle_photo' type='file'>
											{(fieldProps: FieldProps) => (
												<input
													{...fieldProps.field}
													type='file'
													id='photo'
													className='hidden'
													accept='image/*'
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
														const file = e.target.files && e.target.files[0]; // Get the first file if it exists
														if (file) {
															try {
																const imageUrl = URL.createObjectURL(file);
																setPreview(imageUrl);

																const reader = new FileReader();
																if (reader) {
																	reader.onload = function (event: ProgressEvent<FileReader>) {
																		if (event.target && event.target.result && typeof event.target.result === 'string') {
																			const imgTag = document.getElementById('myimage') as HTMLImageElement | null;
																			if (imgTag) {
																				imgTag.title = file.name;
																				imgTag.src = event.target.result;
																			}
																		}
																	};
																	reader.readAsDataURL(file);
																}

																console.log(file, 'get file');
																fieldProps.form.setFieldValue(fieldProps.field.name, file);
															} catch (error) {
																console.log(error);
															}
														}
													}}
												/>
											)}
										</Field>

										<ErrorMessage
											name='vehicle_photo'
											render={(msg) => (
												<div style={{ color: '#f10000' }} className='error'>
													{msg}
												</div>
											)}
										/>
									</div>
								</div>

								<label htmlFor='vehicle_type' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Vehicle name
								</label>
								<Field name='vehicle_name'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='' />}</Field>

								<ErrorMessage
									name='vehicle_name'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='vehicle_price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Vehicle price
								</label>
								<Field name='vehicle_price'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='' />}</Field>

								<ErrorMessage
									name='vehicle_price'
									render={(msg) => (
										<div style={{ color: '#f10000' }} className='error'>
											{msg}
										</div>
									)}
								/>
							</div>

							<div>
								<label htmlFor='vehicle_type' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
									Vehicle type
								</label>
								<Field name='vehicle_type'>
									{(fieldProps: FieldProps) => (
										<select {...fieldProps.field} id='vehicle_type' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
											<option value=''>Select type</option>
											<option value='open air' selected={fieldProps.field.value === 'open air'}>
												open air
											</option>
											<option value='air condition' selected={fieldProps.field.value === 'air condition'}>
												air condition
											</option>
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
