import { useCallback, useState } from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import { onToggleNavHomepageMobile, useSelectIndex } from '../../../utils/hooks/globa.state';
import '../styles/dashboard-main.css'
import clsx from 'clsx';
import useNavigationHandler from '../../../utils/hooks/useNavigationHandler';
import { RootState, useAppSelector } from '../../../utils/redux/store';
import { Button, Label, TextInput } from 'flowbite-react';
import { FaSave, FaRegUserCircle } from 'react-icons/fa';
import { BiRfid } from 'react-icons/bi';
import { Formik, Form, ErrorMessage, FieldProps,Field } from 'formik';
import * as Yup from 'yup';
import { useAddPersonalDetailsMutation, useGetPersonalDetailsByIdQuery } from '../../../api-query/personal-details.api';
import { enqueueSnackbar } from 'notistack';
import { isEmpty, isNull } from 'lodash';
import { useGetProfileAccountQuery, useUpdateProfileAvatarMutation } from '../../../api-query/account-api';
import { IUser } from '../../../utils/redux/slicer/authSlice';
import Immutable from '../../../immutable/constant';

import displayFullName from '../../../utils';
import dayjs from 'dayjs';

const listOrders = [
	{
		label: `Dashboard`,
		index: 'dashboard',
	},
	{
		label: 'My Profile',
		index: 'profile',
	},
	{
		label: 'Account details',
		index: 'profile',
	},
	{
		label: 'Schedule',
		index: 'sched',
	},
	{
		label: 'Logout',
		index: 'signout',
	},
];


interface FormData {
	fullname: string;
	age: number;
	birthdate: Date | string;
	gender: 'male' | 'female' | string;
	nationality: string;
	address: string;
	mobileNumber: number;
	account_id: string;
	postal_code?: number;
}


const personalInfromationSchema = Yup.object().shape({
	fullname: Yup.string().required('Full name is required'),
	age: Yup.number().required('Age is required').min(18, 'Minor is not allowed'),
	birthdate: Yup.date().nullable().required('Birthdate is required'),
	gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
	nationality: Yup.string().required('Nationality is required'),
	address: Yup.string().required('Address is required'),
	mobileNumber: Yup.number().required('Mobile number is required').min(11, 'Mobile number required 11 digits'),
	status: Yup.string(),
	account_id: Yup.string(),
	postal_code: Yup.number()
		.required('Postal is required')
		.test('len', 'Postal code must be exactly 4 digits', (val) => val.toString().length === 4),
});


const DashboardUser = () => {
	const [toggle] = onToggleNavHomepageMobile();
	 const [onHandlerNavigationEvent] = useNavigationHandler();
	const [selectIndex, setSelectIndex] = useSelectIndex();
	const [addPersonalDetails] = useAddPersonalDetailsMutation();
	const [updateProfileAvatar] = useUpdateProfileAvatarMutation();
		
	
	const user = useAppSelector((state: RootState) => state.authUser);


	const { data: userProfile } = useGetProfileAccountQuery(user.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
	const { data: userProfileDetails } = useGetPersonalDetailsByIdQuery(user.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
	const [preview,setPreview] = useState<string>('');


	const getProfileUser = !isEmpty(userProfile) ? userProfile : null;
	const getProfileDetails = !isEmpty(userProfileDetails) ? userProfileDetails : null;


	const onSigoutOut = useCallback(()=>{
		onHandlerNavigationEvent('signout');
	},[])
  

	const onSelectedMainContent = (index:number)=>{
		
		if(index == 4){
			onSigoutOut(); 
		}else{
			setSelectIndex(index);
		}

	}



 const handlePersonalInformationSubmit = async(values: FormData) => {


		try {

			const { fullname, ...restValues } = values;


			const splitFullname = values.fullname.split(' ');


			const formValue = {
				firstname: splitFullname[0],
				midlename: splitFullname[1],
				lastname: splitFullname[2],
				...restValues,
			};

			let addNewDetails:any = await addPersonalDetails({
				body: formValue,
			});


			if(!isEmpty(addNewDetails)){
					let msg = addNewDetails.data.message;

					
					if (msg == 'Personal information existed') {
						enqueueSnackbar(msg, { variant: 'success', autoHideDuration: 3000 });
					} else {
						enqueueSnackbar(msg, { variant: 'success', autoHideDuration: 3000 });
					}
			}


		} catch (error) {
			console.log(error)
		}
 };


const onFileUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
	if(!isNull(e.target.files)){

		try {
					let getFile = e.target.files[0] as File;

					const imageUrl = URL.createObjectURL(getFile);
					setPreview(imageUrl);

			const id: IUser['id'] = user.id as IUser['id'];

			console.log(id);

				const formData =  new FormData();
				formData.append('user_id', id as unknown as string);
				formData.append('profile_photo', getFile);

				const updateProfile = await updateProfileAvatar({ id: user.id, data: formData });

				console.log(updateProfile);

				enqueueSnackbar('Avatar was updated', { variant: 'success', autoHideDuration: 3000 });
			

				
		} catch (error) {
			console.log(error)
		}

	}
};



const dateNow = dayjs().format('YYYY-DD-MM');


const initialValues: FormData = {
	fullname: displayFullName(getProfileDetails?.firstname, getProfileDetails?.midlename, getProfileDetails?.lastname) ?? '',
	age: getProfileDetails?.age ?? 0,
	birthdate: dayjs(getProfileDetails?.birthdate).format('YYYY-DD-MM') ?? dateNow,
	gender: getProfileDetails?.gender ?? '',
	nationality: getProfileDetails?.nationality ?? '',
	address: getProfileDetails?.address ?? '',
	mobileNumber: Number(getProfileDetails?.mobileNumber) ?? 0,
	account_id: getProfileUser?.account_id ?? '',
	postal_code: Number(getProfileDetails?.postal_code) ?? '',
};

const onDateSetRetrival = (e: React.FormEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>, formikProps: FieldProps<any>) => {
	let value = '';

	if ('currentTarget' in e) {
		value = (e.currentTarget as HTMLInputElement).value;
	}

	let chosenYear = new Date(value).getFullYear();
	let currentYear = new Date().getFullYear();
	let dateDiff = Math.abs(currentYear - chosenYear);

	console.log(value,'get value');

	formikProps.form.setFieldValue('birthdate', value);
	formikProps.form.setFieldValue('age', dateDiff);
};



	return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[100%] sm:h-[60vh]  md:h-[50vh] lg:h-[40vh] mt-[5rem]'>
				<div className='grid grid-cols-2 w-[80%] mx-auto h-full' style={{ gridTemplateColumns: '0.3fr 1fr', gridTemplateRows: '70vh 60vh' }}>
					<aside className='flex justify-center bg-secondary rounded-md'>
						<ul className={clsx('flex', 'flex-col', 'text-lite', 'w-full', 'h-full', 'text-center', 'pb-5', 'justify-start', 'border-top', 'gap-2')}>
							{listOrders.map((item, i) => {
								if (i == 0) {
									return (
										<li key={i} className='p-5 bg-accent' onClick={() => onSelectedMainContent(i)}>
											<a className='hover:text-white cursor-pointer font-medium'>
												{item.label} (<span className='font-semibold'>Buyer</span>)
											</a>
										</li>
									);
								} else {
									return (
										<li key={i} className='nav-list p-5 nav-active' onClick={() => onSelectedMainContent(i)}>
											<a className='nav-item'>{item.label}</a>
										</li>
									);
								}
							})}
						</ul>
					</aside>
					<main className='bg-white relative z-10'>
						<RenderIf value={selectIndex == 0}>
							<div className='flex flex-col p-5 leading-9'>
								<h4 className='py-5 text-navy font-medium'>Dashboard</h4>
								<hr className='border-dotted border-1 border-teal-600' />

								<div style={{ border: '1px solid #eaeaea' }} className='p-5 my-5'>
									<h5>
										Hello, <span className='font-medium'>{user.displayName}</span>
									</h5>
									<p className='m-0 leading-6'>Introducing our RFID e-wallet solution, your hassle-free way to make transactions on the go. Simply tap your RFID-enabled device to pay securely and swiftly. Track your spending, reload funds, and enjoy the convenience of contactless payments with ease.</p>
								</div>
								<div className='grid grid-cols-2 w-[90%] mx-auto'>
									<div>
										<label className='font-medium text-navy' htmlFor=''>
											E-wallet
										</label>
										<div id='empty-cover-art' className='shadow-md py-5 h-28 rounded w-56 bg-accent text-center opacity-80 md:border-solid md:border-2 md:border-teal-300'>
											<center>
												<BiRfid size={50} color='#ffffff' />
											</center>
											<div className=''>
												<span className='font-mono text-white rounded'>0x3e622535435345345</span>
											</div>
										</div>
									</div>
									<div>
										<label className='font-medium text-navy' htmlFor=''>
											Balance ( ₱0.00 )
										</label>
									</div>
								</div>
							</div>
						</RenderIf>

						<RenderIf value={selectIndex == 1}>
							<form className='flex flex-col gap-4 w-full'>
								<div className='flex flex-col py-2 px-5 leading-2'>
									<div className='flex justify-end items-center'>
										<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
											<FaSave />
										</Button>
									</div>
									<h4 className='py-5 text-navy font-medium'>
										My Profile &nbsp;(<span className='text-navy font-semibold'>{user.email}</span>)
									</h4>
									<hr className='border-dotted border-1 border-teal-600' />

									<div style={{ border: '1px solid #eaeaea', minHeight: '40vh' }} className='p-5 rounded-md my-5'>
										<div className='w-full py-4 flex flex-col items-center gap-2 mb-4'>
											<label htmlFor='updateAvatar' className='cursor-pointer'>
												<RenderIf value={!isEmpty(preview)}>
													<div className='shadow-md p-2 rounded-full w-[8rem] h-[8rem] flex justify-center items-center'>
														<img className='object-cover  w-[6rem] h-[6rem]' src={preview} alt='Preview' />
													</div>
												</RenderIf>
												<RenderIf value={!isEmpty(getProfileUser?.photo as string) && isEmpty(preview)}>
													<div className='shadow-md p-2 rounded-full w-[8rem] h-[8rem] flex justify-center items-center'>
														<img className='object-cover  w-[6rem] h-[6rem]' src={`${Immutable.API}/account/photo/${getProfileUser?.user_id}`} alt='Preview' />
													</div>
												</RenderIf>
												<RenderIf value={isEmpty(preview) && isEmpty(getProfileUser?.photo as string)}>
													<div className='uppercase bg-lite rounded-full py-1 px-3 w-[8rem] h-[8rem] flex justify-center items-center text-white text-3xl'>
														{/* {user.displayName.slice(0, 1)} */}
														<img className='w-[3rem] h-[3rem] rounded-full' src={user.picture} alt={user.picture} />
													</div>
												</RenderIf>
											</label>
											<div className='block'>
												<Label className='text-navy' htmlFor='displayname' value={user.displayName} />
												<input type='file' name='updateAvatar' id='updateAvatar' className='hidden' accept='image/*' onChange={onFileUpload} />
											</div>
										</div>
										<div className='w-full'>
											<div className='block'>
												<Label className='text-navy' htmlFor='fullname' value='Display name' />
											</div>
											<TextInput value={user?.displayName ?? ''} rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='Firstname ,Middle name,Lastname,Jr/Sr' />
										</div>
									</div>
								</div>
							</form>
						</RenderIf>

						<RenderIf value={selectIndex == 2}>
							<Formik initialValues={initialValues} validationSchema={personalInfromationSchema} onSubmit={handlePersonalInformationSubmit}>
								<Form className='flex flex-col gap-4 w-full'>
									<div className='flex flex-col py-2 px-5 leading-2'>
										<div className='flex justify-end items-center'>
											<Button className='bg-accent hover:bg-accent outline-none border-none' type='submit'>
												<FaSave />
											</Button>
										</div>
										<h4 className='py-5 text-navy font-medium'>Account details</h4>
										<hr className='border-dotted border-1 border-teal-600' />

										<div style={{ border: '1px solid #eaeaea', maxHeight: '20vh' }} className='p-5 my-5'>
											<div className='w-full'>
												<div className='block'>
													<Label className='text-navy' htmlFor='fullname' value='Fullname' />
												</div>

												<Field name='fullname'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='Firstname ,Middle name,Lastname,Jr/Sr' />}</Field>

												<ErrorMessage
													name='fullname'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>
											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='age' value='Age' />
												</div>
												<Field readonly name='age'>
													{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} name='age' color='info' id='age' type='number' />}
												</Field>

												<ErrorMessage
													name='age'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>

											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='mobileNumber' value='Mobile number' />
												</div>
												<Field name='mobileNumber'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' id='mobileNumber' type='number' minLength={11} />}</Field>

												<ErrorMessage
													name='mobileNumber'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>

											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='birthdate' value='Birthdate' />
												</div>
												<Field name='birthdate'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} onChange={(e) => onDateSetRetrival(e, fieldProps)} name='birthdate' color='info' id='age' type='date' />}</Field>

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
												<label htmlFor='gender' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
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

											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='nationality' value='Nationality' />
												</div>
												<Field name='nationality'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' id='nationality' name='nationality' type='text' value={'Filipino'} required />}</Field>

												<ErrorMessage
													name='nationality'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>

											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='address' value='Address' />
												</div>
												<Field name='address'>{(fieldProps: FieldProps) => <TextInput {...fieldProps.field} color='info' id='address' type='text' placeholder='Street,Purok,Brgy,Town' required />}</Field>
												<ErrorMessage
													name='address'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>

											<div>
												<div className='block'>
													<Label className='text-navy' htmlFor='postal' value='Postal code' />
												</div>
												<Field name='postal_code'>{(fieldProps: FieldProps) => <TextInput type='number' {...fieldProps.field} color='info' id='postal' placeholder='4023' required />}</Field>
												<ErrorMessage
													name='postal_code'
													render={(msg) => (
														<div style={{ color: '#f10000' }} className='error'>
															{msg}
														</div>
													)}
												/>
											</div>
										</div>
									</div>
								</Form>
							</Formik>
						</RenderIf>

						<RenderIf value={selectIndex == 3}>
							<div>Schedule</div>
						</RenderIf>
						<RenderIf value={selectIndex == 4}>
							<div>Schedule</div>
						</RenderIf>
					</main>
				</div>
			</main>
		</RenderIf>
	);
};

export default DashboardUser;
