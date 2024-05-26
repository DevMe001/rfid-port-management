import React, { useCallback, useState } from 'react';
import { VehicleType, Vehicles } from '../../../../api-query/types';
import { useGetVehicleRecordQuery, useDeleteVehicleMutation, useUpdateVehicleMutation, useNewVehicleTypeMutation, useUpdateVehicleTypeMutation, useFilterVehicleTypeMutation } from '../../../../api-query/vehicle-api';
import CustomButton from '../../../../common/components/ui/button.componetnt';
import { DashboardHeader } from '../../../../common/components/ui/main.ui.component';
import RenderIf from '../../../../common/components/ui/render-if';
import PopupModal from '../../../../common/widget/modal/popup.,modal';
import { getVehicleRenderType, onPopupModal, onVehicleModal } from '../../../../utils/hooks/globa.state';
import useDebounceRef from '../../../../utils/hooks/useDebounce';
import usePagination from '../../../../utils/hooks/usePagination';
import Breadcrumbs from '../../component/Breadcrumbs';
import SearchInput from '../../component/Search';
import TableRender from '../../component/Table';
import withAdminWrapper from '../../component/admin-wrapper';
import { useDeleteVehicleByIdMutation, useGetVehicleTypesQuery } from '../../../../api-query/vehiclescategory-services';
import KebabMenu from '../../component/KebabDropdown';
import PaginationRender from '../../component/Pagination';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import { Button, TextInput } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';
import * as Yup from 'yup';
import InputFieldFormInput from '../../../../common/components/ui/input-form';
import { isEmpty } from 'lodash';

	type FormData = {
		vehicletype_name: string;
		carrier_fee: number;
	};


const typeCAtegorySchema = Yup.object().shape({
	vehicletype_name: Yup.string().required('Field is not empty.'),
	carrier_fee: Yup.number().min(100, 'Minimum value is 100').required('Field is not empty.'),
});

type ActionFormData = {
	row?: Partial<VehicleType>;
	action: string;
};

const VehicleCategoryRender: React.FC<ActionFormData> = ({ row, action }) => {
	const [category, setCategory] = onPopupModal();


	const [updateVehicleType] = useUpdateVehicleTypeMutation();
	const [newVehicleType] = useNewVehicleTypeMutation();

	const onCloseModal = useCallback(() => {
		setCategory(false);
		document.body.style.overflow = '';
	}, []);

	const initialValue: FormData = {
		vehicletype_name: row?.vehicletype_name ?? '',
		carrier_fee: row?.carrier_fee ?? 0,
	};

	const onSubmitHandler = async (values: FormData, actions: FormikHelpers<FormData>) => {
		console.log(values);

		if (action === 'edit') {
			
			const details = {
				vehicletype_id: row?.vehicletype_id,
				...values,
			};

			const res = await updateVehicleType(details);

			console.log(res)

			actions.resetForm();
		} else {
			console.log(values);

			const res = await newVehicleType(values);

			console.log(res)

			actions.resetForm();
		}
		setCategory(false);
	};

	return (
		<Formik initialValues={initialValue} validationSchema={typeCAtegorySchema} enableReinitialize={true} onSubmit={onSubmitHandler}>
			<RenderIf value={category}>
				<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
					<div className='w-[20rem]'>
						<Form className='flex flex-col gap-4 w-full'>
							<InputFieldFormInput labelName='Vehicle type' fieldName='vehicletype_name' />
							<InputFieldFormInput labelName='Carrier fee' type='number' fieldName='carrier_fee' />

							<div className='flex justify-end items-center mt-5'>
								<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
									Save &nbsp; <FaSave />
								</Button>
							</div>
						</Form>
					</div>
				</PopupModal>
			</RenderIf>
		</Formik>
	);
};

const VehicleTypeCategories: React.FC = () => {
	const header = ['ID', 'vehicle name', 'carrier fee',  'Action'];

	const { data: vehicleRecord } = useGetVehicleTypesQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<VehicleType>(vehicleRecord as unknown as VehicleType[], 3);



	const [deleteVehicleById] = useDeleteVehicleByIdMutation();

	const onDeleteVehicleCategory = async (id: string) => {
		console.log(id);
		await deleteVehicleById(id);
	};

	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		String(row.vehicletype_id),
		String(row.vehicletype_name),
		<span>&#8369; {String(row.carrier_fee)}</span>,
		<KebabMenu
			list={[
				{ label: 'Edit', onClick: () => onTypeToggle('edit', row) },
				{ label: 'Delete', onClick: () => onDeleteVehicleCategory(row.vehicletype_id) },
			]}
		/>,
	]);

	const [filter, setFilter] = useState<string>('');
	const [, setType] = onPopupModal();

	const [filterVehicleType] = useFilterVehicleTypeMutation();

	const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFilter(value);
	}, 200);

	const onSubmitHandler = async () => {
		const filterQuery:any = await filterVehicleType(filter);

		if (!isEmpty(filter)) {
			setData(filterQuery.data.data);
		} else {
			setData(vehicleRecord as unknown as VehicleType[]);
		}
	};

	const [dataRow, setRow] = getVehicleRenderType();

	

	const [actionState, setAction] = useState<string>('add');

	// handle for add vehile icon
	const onTypeToggle = useCallback((action: string, row?: Partial<VehicleType>) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.body.style.overflow = 'hidden';
		setType(true);

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
				<Breadcrumbs group='Schedule' activeLink='Vehicle category' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-start lg:justify-end pr-5 -mt-5 lg:mt-10'>
						<CustomButton onClick={() => onTypeToggle('add')} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<RenderIf value={actionState === 'edit'}>
				<VehicleCategoryRender row={dataRow} action='edit' />
			</RenderIf>
			<RenderIf value={actionState === 'add'}>
				<VehicleCategoryRender action='add' />
			</RenderIf>
		</>
	);
};

export default withAdminWrapper(VehicleTypeCategories);
