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
import { getAccountUserRender, onPopupModal, onVehicleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import PopupModal from '../../../common/widget/modal/popup.,modal';
import KebabMenu from '../component/KebabDropdown';
import { useDeleteAccountDetailsMutation, useGetAccountsQuery, useNewAccountDetailsMutation, useUpdateAccountDetailsMutation } from '../../../api-query/account-api';
import { isEmpty, isNull, toString } from 'lodash';
import PaginationRender from '../component/Pagination';
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers, FormikProps, ErrorMessage } from 'formik';
import { FaRegImage } from 'react-icons/fa6';
import FileInput from '../component/Files';
import { Button } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';
import InputFieldFormInput from '../../../common/components/ui/input-form';



type ActionFormData = {
	row?: Partial<Account>;
	action: string;
};

const UserFormRender: React.FC<ActionFormData> = ({ row, action }) => {
	const [userModal, setuser] = onPopupModal();

	const [preview, setPreview] = useState<string>('');

	const onCloseModal = useCallback(() => {
		setuser(false);
		document.body.style.overflow = '';
	}, []);

	const validatinoSchemaFormUser = (action: string) => {
		const schema = Yup.object().shape({
			photo: action == 'edit' ? Yup.mixed() : Yup.mixed().required('required'),
			user_id: Yup.string(),
			displayName: Yup.string().required('Field is required'),
			email: Yup.string().required('Field is required'),
		});

		return schema;
	};

	const initialValues: Account = {
		user_id: '',
		displayName: row?.displayName ?? '',
		email: row?.email ?? '',
		photo: '',
	};

	const [newAccountDetails] = useNewAccountDetailsMutation();
	const [updateAccountDetails] = useUpdateAccountDetailsMutation();

	const handleSubmitRequest = async (values: Account, actions: FormikHelpers<Account>) => {
		console.log(values);

		const formData = new FormData();

		formData.append('displayName', values.displayName);
		formData.append('email', values?.email);
		formData.append('profile_photo', values?.photo);

		if (action === 'edit') {
			formData.append('account_id', row?.account_id as string);
			formData.append('old_file', row?.photo as string);

			const res = await updateAccountDetails(formData);

			console.log(res);
			actions.resetForm();
			setuser(false);
		} else {
			const randomGen = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;

			formData.append('user_id', toString(randomGen));

			const res = await newAccountDetails(formData);

			console.log(res);
			actions.resetForm();
			setuser(false);
		}
	};

	const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: FormikProps<Account>['setFieldValue']) => {
		if (!isNull(e.target.files)) {
			try {
				let getFile = e.target.files[0] as File;

				setFieldValue('photo', getFile);

				const imageUrl = URL.createObjectURL(getFile);
				setPreview(imageUrl);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<Formik initialValues={initialValues} validationSchema={validatinoSchemaFormUser(action)} onSubmit={handleSubmitRequest} enableReinitialize={true}>
			{({ setFieldValue }) => (
				<RenderIf value={userModal}>
					<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
						<div className='w-[20rem]'>
							<Form className='flex flex-col gap-4 w-full'>
								<div className='w-full py-4 flex flex-col items-center gap-2 mb-4'>
									<label htmlFor='photo' className='cursor-pointer'>
										<RenderIf value={!isEmpty(preview)}>
											<img className='object-cover  w-[6rem] h-[6rem]' src={preview} alt='Preview' />
										</RenderIf>
										<RenderIf value={isEmpty(preview) && !isEmpty(row?.photo)}>
											<img src={`http://localhost:8000/account/file/${row?.photo}`} className='object-cover  w-[6rem] h-[6rem]' alt='Preview' />
										</RenderIf>
										<RenderIf value={isEmpty(preview) && isEmpty(row?.photo)}>
											<div className='shadow-md p-2 rounded-full w-[8rem] h-[8rem] flex justify-center items-center'>
												<FaRegImage size={40} />
											</div>
										</RenderIf>
									</label>
									<p className='font-medium'>Upload photo</p>
									<div className='block'>
										<FileInput onChange={(e) => onFileUpload(e, setFieldValue)} fieldName='photo' />
										<ErrorMessage
											name='photo'
											render={(msg) => (
												<div style={{ color: '#f10000' }} className='error'>
													{msg}
												</div>
											)}
										/>
									</div>
								</div>

								<InputFieldFormInput labelName='Display name' fieldName='displayName' />
								<InputFieldFormInput labelName='Email' fieldName='email' />

								<div className='flex justify-end items-center mt-5'>
									<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
										Save &nbsp; <FaSave />
									</Button>
								</div>
							</Form>
						</div>
					</PopupModal>
				</RenderIf>
			)}
		</Formik>
	);
};







const UserControl:React.FC = () => {
	const header = ['ID', 'Username','Email','Photo', 'Action']; 

	const { data: userRecord } = useGetAccountsQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });




	const { paginatedData, handlePagination, currentPage, totalPages } = usePagination<Account>(userRecord as unknown as Account[], 5);




	const [deleteAccountDetails] = useDeleteAccountDetailsMutation();

	const onDeleteAccount = async (id: string) => {

		console.log(id);
		 await deleteAccountDetails(id);
	};




	
  
	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		<span>{row.user_id}</span>,
		<span>{row.displayName}<strong> ({row.role == 1 ? 'Admin' : 'User'}</strong>)</span>,
		<span>{row.email}</span>,
			<img src={!isEmpty(row.photo) ? `http://localhost:8000/account/photo/${row.user_id}` : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'} className='w-[50px] h-[50px]' />,

	<KebabMenu
			list={[
				{  label: 'Edit',onClick:()=> onUserToggle('edit',row)}  ,
				{  label: 'Delete',onClick:()=> onDeleteAccount(row.account_id as string)}
			]}
		/>,
	]);


const [filter, setFilter] = useState<string>('');
const [, setAccount] = onPopupModal();


const [dataRow, setRow] = getAccountUserRender();


const [actionState, setAction] = useState<string>('add');
	
	
const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	setFilter(value);
}, 200);

const onSubmitHandler = async () => {
	// const filterQuery: any = await filterRfidQuery(filter);
	// setData(filterQuery.data.data);

	console.log(filter);
};



const onUserToggle = useCallback((action: string, row?: Partial<Account>) => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
	document.body.style.overflow = 'hidden';
	setAccount(true);

	setAction(action);
	if (row) {
	
		setRow({}); 

	
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
				<Breadcrumbs group='Setting' activeLink='Users' />
				<div className='mt-10 w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-start lg:justify-end pr-5 -mt-5 lg:mt-10'>
						<CustomButton onClick={() => onUserToggle('add')} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<RenderIf value={actionState === 'edit'}>
				<UserFormRender row={dataRow} action='edit' />
			</RenderIf>
			<RenderIf value={actionState === 'add'}>
				<UserFormRender action='add' />
			</RenderIf>
		</>
	);
}

export default withAdminWrapper(UserControl);
