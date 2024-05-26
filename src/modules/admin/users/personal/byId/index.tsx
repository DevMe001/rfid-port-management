import React, { useEffect, useMemo } from 'react'
import withAdminWrapper from '../../../component/admin-wrapper';
import { DashboardHeader } from '../../../../../common/components/ui/main.ui.component';
import Breadcrumbs from '../../../component/Breadcrumbs';
import InputFieldFormInput from '../../../../../common/components/ui/input-form';
import { Formik, Form, ErrorMessage, Field, FieldProps } from 'formik';
import { FaSave } from 'react-icons/fa';
import { Button, TextInput } from 'flowbite-react';
import {  useGetFilterByPersonalIdQuery, useUpdatePersonalDetailsMutation } from '../../../../../api-query/personal-details.api';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { PersonalInformation } from '../../../../../api-query/types';
import { enqueueSnackbar } from 'notistack';
import waitSec from '../../../../../utils/setTimeout';


export const PersonalDetailsById = () => {

	const params = useParams();

	console.log(params.id, 'get params');

	const navigate = useNavigate();


	const { data: personalDetails,isError } = useGetFilterByPersonalIdQuery(params.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });



const [updatePersonalDetails] = useUpdatePersonalDetailsMutation();

	useEffect(() => {

		if(isError){
			navigate('/admin-dashboard/personal');
		}



	}, [isError]);


	const schema = Yup.object().shape({
		firstname: Yup.string().required('Field is required'),
		midlename: Yup.string().required('Field is required'),
		lastname: Yup.string().required('Field is required'),
		age: Yup.number().required('Field is required').min(18, 'Age at leas 18 years old'),
		mobileNumber: Yup.number().required('Field is required').min(11, 'Length must be 11 digits'),
		birthdate: Yup.date(),
		gender: Yup.string().required('Field is required'),
		nationality: Yup.string().required('Field is required'),
		address: Yup.string().required('Field is required'),
		postal_code: Yup.string()
			.required('Field is required')
			.matches(/^\d{4}$/, 'Postal code must be exactly 4 digits'),
	});


	const initialValues: Partial<PersonalInformation> = {
		firstname: personalDetails?.data?.firstname ?? '',
		midlename: personalDetails?.data?.midlename ?? '',
		lastname: personalDetails?.data?.lastname ?? '',
		age: personalDetails?.data?.age ?? 0,
		birthdate: (personalDetails?.data?.birthdate.split('T')[0] as string) ?? new Date(),
		gender: personalDetails?.data?.gender ?? '',
		nationality: personalDetails?.data?.nationality ?? '',
		address: personalDetails?.data?.address ?? '',
		mobileNumber: personalDetails?.data?.mobileNumber ?? '',
		postal_code: personalDetails?.data?.postal_code ?? '',
	};



	const submtiHandler = async(values: Partial<PersonalInformation>) => {


		const dataObj = {
			personal_id: personalDetails?.data.personal_id as string ?? params.id,
			...values,
		};

				console.log(dataObj);


			const res:any = await updatePersonalDetails(dataObj);

			if('data' in res){
				let msg: string = res.data.message as string;
					enqueueSnackbar(msg, { variant: 'success', autoHideDuration: 3000 });
					await waitSec(1000);
					navigate('/admin-dashboard/personal');

			}else{
					enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000 });

			}

	

	};	
	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Setting' activeLink='User information' />
				<div className='bg-white m-10 py-10 rounded-md'>
					<Formik initialValues={initialValues} validationSchema={schema} onSubmit={submtiHandler} enableReinitialize={true}>
						{({ setFieldValue }) => (
							<Form>
								<div className='px-5'>
									<div className='flex justify-end items-center'>
										<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
											<FaSave />
										</Button>
									</div>

									<div>
										<label htmlFor='account_id' className='block mb-2 font-medium text-navy'>
											User account (<strong>{personalDetails?.data.accounts.displayName as string}</strong>)
										</label>
									</div>

									<InputFieldFormInput labelName='First name' fieldName='firstname' />
									<InputFieldFormInput labelName='Midle name' fieldName='midlename' />
									<InputFieldFormInput labelName='Last name' fieldName='lastname' />
									<InputFieldFormInput labelName='Age' fieldName='age' />
									<InputFieldFormInput labelName='Mobile No.' fieldName='mobileNumber' type='number' />
									<div className='my-3'>
										<div className='block'>
											<label htmlFor='account_id' className='block mb-2 font-medium text-navy'>
												Birthdate
											</label>
										</div>
										<Field name='birthdate'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} name='birthdate' color='info' id='age' type='date' />}</Field>

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
									<InputFieldFormInput labelName='Nationality' fieldName='nationality' />
									<InputFieldFormInput labelName='Address' fieldName='address' />
									<InputFieldFormInput labelName='Postal code' fieldName='postal_code' type='number' />
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);

};

export default withAdminWrapper(PersonalDetailsById);
