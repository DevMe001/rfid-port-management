import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Account, PersonalInformation, Vehicles } from "../../../../api-query/types";
import {  useDeleteVehicleMutation } from "../../../../api-query/vehicle-api";
import CustomButton from "../../../../common/components/ui/button.componetnt";
import { DashboardHeader } from "../../../../common/components/ui/main.ui.component";
import RenderIf from "../../../../common/components/ui/render-if";
import PopupModal from "../../../../common/widget/modal/popup.,modal";
import { getPersonalInformation, onPopupModal } from "../../../../utils/hooks/globa.state";
import useDebounceRef from "../../../../utils/hooks/useDebounce";
import usePagination from "../../../../utils/hooks/usePagination";
import Breadcrumbs from "../../component/Breadcrumbs";
import SearchInput from "../../component/Search";
import TableRender from "../../component/Table";
import withAdminWrapper from "../../component/admin-wrapper";
import { useAddPersonalDetailsMutation, useDeletePersonalDetailsMutation, useGetAllUserNullInformationQuery, useGetFilterPersonalSearchTermsMutation, useGetFilterUserPersonalMutation, useGetPersonalInfromationQuery } from "../../../../api-query/personal-details.api";
import KebabMenu from "../../component/KebabDropdown"; 
import PaginationRender from "../../component/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import moment from "moment";
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers, FieldProps, ErrorMessage, Field } from 'formik';
import {  Button, TextInput } from "flowbite-react";
import { FaSave } from "react-icons/fa";
import InputFieldFormInput from "../../../../common/components/ui/input-form";
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from 'react-icons/io5';
import Select from 'react-select';
import { enqueueSnackbar } from "notistack";

const PersonalDetailsRender: React.FC= () => {
	const [personalDetailsModal, setPersonalDetails] = onPopupModal();

	const { data: getAllUserNullInfo } = useGetAllUserNullInformationQuery(undefined,{pollingInterval:3000,refetchOnMountOrArgChange:true,skip:false});



	const [addPersonalDetails] = useAddPersonalDetailsMutation();



	const [page,setPage] = useState<number>(0);

	const onCloseModal = useCallback(() => {
		setPersonalDetails(false);
		document.body.style.overflow = '';
	}, []);

	const validationFormDetails = (page:number) => {
		const schema = Yup.object().shape({
			account_id: Yup.string().required('Field is required'),
			firstname: Yup.string().required('Field is required'),
			midlename: Yup.string().required('Field is required'),
			lastname: Yup.string().required('Field is required'),
			age: page == 1 ? Yup.number().required('Field is required').min(18, 'Age at leas 18 years old') : Yup.number(),
			mobileNumber: page == 1 ? Yup.number().required('Field is required').min(11, 'Length must be 11 digits') : Yup.number(),
			birthdate: Yup.date(),
			gender: page == 1 ? Yup.string().required('Field is required') : Yup.string(),
			nationality: page == 2 ? Yup.string().required('Field is required') : Yup.string(),
			address: page == 2 ? Yup.string().required('Field is required') : Yup.string(),
			postal_code:
				page == 2
					? Yup.string()
							.required('Field is required')
							.matches(/^\d{4}$/, 'Postal code must be exactly 4 digits')
					: Yup.string(),
		});

		return schema;
	};

	const initialValues: Partial<PersonalInformation> = {
		account_id:'',
		firstname: '',
		midlename: '',
		lastname: '',
		age: 0,
		birthdate: '',
		gender: '',
		nationality: '',
		address: '',
		mobileNumber: '',
		postal_code:0,
	};


	const handleSubmitRequest = async (values: Partial<PersonalInformation>, _actions: FormikHelpers<Partial<PersonalInformation>>) => {
		console.log(values);
		if(page < 2){
			setPage((prev) => prev + 1);
		}else{
			const addRequest = await addPersonalDetails({ body: values });


			if('data' in addRequest){
				enqueueSnackbar(addRequest?.data?.message as string, { variant: 'success', autoHideDuration: 3000 });
			}

			setPersonalDetails(false);
		}
	};


	const prevHandler = useCallback(()=>{
		setPage((prev) => prev > 0 ? prev - 1 : prev);

	},[])


	const [accoutAvailable,setAccountAvailable] = useState<boolean>(false);


	  const option = useMemo(() => {
			const newOption = [{ value: '', label: '' }];

			if (!isEmpty(getAllUserNullInfo?.data)) {
				getAllUserNullInfo?.data.forEach((list) =>
					newOption.push({
						value: list.account_id as string,
						label: list.displayName as string,
					}),
				);
				setAccountAvailable(true);
			}else{
				setAccountAvailable(false);

			}

			return newOption;
		}, [getAllUserNullInfo]);


	return (
		<Formik initialValues={initialValues} validationSchema={validationFormDetails(page)} onSubmit={handleSubmitRequest} enableReinitialize={true}>
			{({ setFieldValue }) => (
				<RenderIf value={personalDetailsModal}>
					<PopupModal maxWidth='max-w-[50rem]' onClose={onCloseModal}>
						<RenderIf value={accoutAvailable}>
							<div className='min-w-[30rem] w-full'>
								<legend className='text-xl fond-semibold'>User Details</legend>
								<hr />
								<Form className='flex flex-col gap-4 w-full mt-5'>
									<RenderIf value={page == 0}>
										<div>
											<label htmlFor='account_id' className='block mb-2 font-medium text-navy'>
												User account
											</label>

											<Field name='account_id'>{(fieldProps: FieldProps) => <Select {...fieldProps.field} options={option} value={option.find((opt) => opt.value === fieldProps.field.value)} onChange={(option) => setFieldValue('account_id', option.value)} />}</Field>

											<ErrorMessage
												name='account_id'
												render={(msg) => (
													<div style={{ color: '#f10000' }} className='error'>
														{msg}
													</div>
												)}
											/>
										</div>
										<InputFieldFormInput labelName='First name' fieldName='firstname' />
										<InputFieldFormInput labelName='Midle name' fieldName='midlename' />
										<InputFieldFormInput labelName='Last name' fieldName='lastname' />

										<div className='flex justify-end items-center mt-5'>
											<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
												Next &nbsp; <IoArrowForwardCircleOutline />
											</Button>
										</div>
									</RenderIf>
									<RenderIf value={page == 1}>
										<InputFieldFormInput labelName='Age' fieldName='age' />

										<InputFieldFormInput labelName='Mobile No.' fieldName='mobileNumber' type='text' />

										<div className='my-3'>
											<div className='block'>
												<label htmlFor='birthdate' className='block mb-2 font-medium text-navy'>
													Birthdate
												</label>
											</div>
											<Field name='birthdate'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} name='birthdate' color='info' id='birthdate' type='date' />}</Field>

											<ErrorMessage
												name='birthdate'
												render={(msg) => (
													<div style={{ color: '#f10000' }} className='error'>
														{msg}
													</div>
												)}
											/>
										</div>

										<div>
											<label htmlFor='gender' className='block mb-2 font-medium text-navy'>
												Gender
											</label>
											<Field name='gender'>
												{(fieldProps: FieldProps) => (
													<select {...fieldProps.field} id='gender' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
														<option value=''>Select gender</option>
														<option value='male' selected={fieldProps.field.value === 'male'}>
															Male
														</option>
														<option value='female' selected={fieldProps.field.value === 'female'}>
															Female
														</option>
													</select>
												)}
											</Field>
											<ErrorMessage
												name='gender'
												render={(msg) => (
													<div style={{ color: '#f10000' }} className='error'>
														{msg}
													</div>
												)}
											/>
										</div>

										<div className='flex justify-around items-center mt-5'>
											<Button onClick={prevHandler} className='text-white  hover:bg-accent outline-none border-none' type='button'>
												&nbsp; <IoArrowBackCircleOutline size={20} /> &nbsp; Prev
											</Button>
											<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
												Next &nbsp; <IoArrowForwardCircleOutline />
											</Button>
										</div>
									</RenderIf>

									<RenderIf value={page == 2}>
										<InputFieldFormInput labelName='Nationality' fieldName='nationality' />
										<InputFieldFormInput labelName='Address' fieldName='address' />
										<InputFieldFormInput labelName='Postal code' fieldName='postal_code' type='number' />

										<div className='flex justify-around items-center mt-5'>
											<Button onClick={prevHandler} className='text-white  hover:bg-accent outline-none border-none' type='button'>
												&nbsp; <IoArrowBackCircleOutline size={20} /> &nbsp; Prev
											</Button>
											<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
												Submit &nbsp; <FaSave />
											</Button>
										</div>
									</RenderIf>
								</Form>
							</div>
						</RenderIf>
						<RenderIf value={!accoutAvailable}>
							<p className="text-red-400 font-medium text-xl"> No account user available</p>
						</RenderIf>
					</PopupModal>
				</RenderIf>
			)}
		</Formik>
	);
};




const PersonalDetails:React.FC = () => {


const personalUserParams = useLocation();

let params = personalUserParams?.pathname.split('/')[3] ?? '';








	const header = ['Full name','Age','Birthdate','Gender','Nationality','Mobile Number', 'Action']; 

	const { data: personalInfoRecord } = useGetPersonalInfromationQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

const [getFilterUserPersonal] = useGetFilterUserPersonalMutation();


	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<PersonalInformation>(personalInfoRecord as unknown as PersonalInformation[], 3);

const navigate = useNavigate();


const [getFilterPersonalSearchTerms] = useGetFilterPersonalSearchTermsMutation();


	const getPersonalInfo = useCallback(async () => {
		const res = await getFilterUserPersonal(params);
		if ('data' in res) {
			console.log(res.data);

			setData(res.data.data as unknown as PersonalInformation[]);
		}
	}, [getFilterUserPersonal, params, setData]);

	useEffect(() => {
		function init() {
			if (!isEmpty(params)) {
				getPersonalInfo();
			}
		}

		init();
	}, [params, getPersonalInfo]);







	const [deletePersonalDetails] = useDeletePersonalDetailsMutation();

	const onDeletePersonalInfo = async (id: string) => {

		console.log(id);
		 await deletePersonalDetails(id);
	};




	
  
	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		<span>
			{row.firstname} &nbsp; {row.lastname}
		</span>,
		String(row.age),
		moment(String(row.birthdate)).format('MMMM DD, YYYY'),
		String(row.gender),
		String(row.nationality),
		String(row.mobileNumber),
		<KebabMenu
			list={[
				{ label: 'View', onClick: () => navigate(`/admin-dashboard/personal/user/${row.personal_id}`) },
				{ label: 'Delete', onClick: () => onDeletePersonalInfo(row.personal_id as string) },
			]}
		/>,
	]);


const [filter, setFilter] = useState<string>('');
const [, setPersonalDetails] = onPopupModal();


const [dataRow, setRow] = getPersonalInformation();

const [actionState, setAction] = useState<string>('add');
	

	
const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	setFilter(value);
}, 200);

const onSubmitHandler = async () => {
	 const filterQuery: any = await getFilterPersonalSearchTerms(filter);
	setData(filterQuery.data.data);

	console.log(filter);
};


const onPersonalInfoToggle = useCallback((action: string, row?: Partial<Account>) => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
	document.body.style.overflow = 'hidden';
	setPersonalDetails(true);

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
				<Breadcrumbs group='Setting' activeLink='Personal information' />
				<div className='mt-10  w-[95%] lg:w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={() => onPersonalInfoToggle('add')} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>

			<PersonalDetailsRender />
		</>
	);
}

export default withAdminWrapper(PersonalDetails);
