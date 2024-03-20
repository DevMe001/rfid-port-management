import { useCallback, useState } from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import '../styles/dashboard-main.css'
import clsx from 'clsx';
import useNavigationHandler from '../../../utils/hooks/useNavigationHandler';
import { useAppSelector } from '../../../utils/redux/store';
import { Button, Label, TextInput, Datepicker } from 'flowbite-react';
import { FaSave, FaRegUserCircle } from 'react-icons/fa';
import { BiRfid } from 'react-icons/bi';
import { DateRangePicker } from '../../../common/widget/calendar/date-range-picker';



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
		label: 'Book',
		index: 'book',
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



const DashboardUser = () => {
	const [toggle] = onToggleNavHomepageMobile();
	 const [onHandlerNavigationEvent] = useNavigationHandler();
	const [selectIndex,setSelectIndex] = useState<number>(0);

	const onSigoutOut = useCallback(()=>{
		onHandlerNavigationEvent('signout');
	},[])
  

	const onSelectedMainContent = (index:number)=>{
		
		if(index == 5){
			onSigoutOut();
		}else{
			setSelectIndex(index);
		}

	}


	const user = useAppSelector((state) => state.authUser);




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
									<p className='m-0 leading-6'>From your account dashboard. you can easily check & view your recent orders, manage your shipping and billing addresses and edit your password and account details.</p>
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
									<DateRangePicker onUpdate={(values) => console.log(values)} initialDateFrom='2023-01-01' initialDateTo='2023-12-31' align='start' locale='en-GB' showCompare={false} />
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
											<div className='uppercase bg-accent rounded-full py-1 px-3 w-[8rem] h-[8rem] flex justify-center items-center text-white text-3xl'>{user.displayName.slice(0, 1)}</div>
											<div className='block'>
												<Label className='text-navy' htmlFor='displayname' value={user.displayName} />
											</div>
										</div>
										<div className='w-full'>
											<div className='block'>
												<Label className='text-navy' htmlFor='fullname' value='Display name' />
											</div>
											<TextInput value={user?.displayName ?? ''} rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='Firstname ,Middle name,Lastname,Jr/Sr' required />
										</div>
									</div>
								</div>
							</form>
						</RenderIf>

						<RenderIf value={selectIndex == 2}>
							<form className='flex flex-col gap-4 w-full'>
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
											<TextInput rightIcon={FaRegUserCircle} color='info' style={{ maxWidth: '100%' }} id='fullname' type='text' placeholder='Firstname ,Middle name,Lastname,Jr/Sr' required />
										</div>
										<div>
											<div className='block'>
												<Label className='text-navy' htmlFor='age' value='Age' />
											</div>
											<TextInput color='info' id='age' type='number' required />
										</div>

										<div>
											<div className='block'>
												<Label className='text-navy' htmlFor='birthdate' value='Birthdate' />
											</div>
											<Datepicker color='info' id='birthdate' required />
										</div>

										<div>
											<label htmlFor='gender' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
												Gender
											</label>
											<select id='coungendertries' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
												<option selected>Male</option>
												<option value='US'>Female</option>
											</select>
										</div>

										<div>
											<div className='block'>
												<Label className='text-navy' htmlFor='nationality' value='Nationality' />
											</div>
											<TextInput color='info' id='nationality' type='text' value={'Filipino'} required />
										</div>

										<div>
											<div className='block'>
												<Label className='text-navy' htmlFor='address' value='Address' />
											</div>
											<TextInput color='info' id='nationality' type='text' placeholder='' value={'Street,Purok,Brgy,Town'} required />
										</div>
									</div>
								</div>
							</form>
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
