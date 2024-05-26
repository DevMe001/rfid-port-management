import React, { useEffect } from 'react'
import withAdminWrapper from '../../component/admin-wrapper'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardHeader } from '../../../../common/components/ui/main.ui.component';
import Breadcrumbs from '../../component/Breadcrumbs';
import { useGetFilterEwalletBydQuery } from '../../../../api-query/wallet-api';
import moment from 'moment';
import { startCase } from 'lodash';


const WalletIDAccount = () => {

const params = useParams();


const  {data:getWalletRecord ,isError,error} = useGetFilterEwalletBydQuery(params.id as string,{pollingInterval:3000,refetchOnMountOrArgChange:true,skip:false})



const navigate = useNavigate();



useEffect(() => {
	if (isError) {
		console.log(error);
		navigate('/admin-dashboard/ewallet');
	}
}, [isError]);



  return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Wallet' activeLink={`${params.id}`} />

				<div className='flex flex-col w-full h-full p-10'>
					<div className='flex justify-between'>
						{/* accounr number */}
						<div className='pt-8 pb-4 px-10 shadow-md rounded leading-10 bg-accent w-[25rem]'>
							<p className='text-sm  text-white'>Account Number</p>
							<p className='text-2xl font-medium text-white'>{getWalletRecord?.account_number}</p>
							<p className='flex items-center gap-2 justify-end pr-5 text-white my-3'>
								<span className='text-sm'>Balance</span>
								<span className='text-2xl font-medium '>
									&#8369; <span>{getWalletRecord?.balance}</span>
								</span>
							</p>
						</div>

						{/* end account number */}
					</div>

					{/* personal information */}
					<p className='font-bold text-3xl text-accent  mt-10 mb-5'>Personal Information</p>

					<div className='w-full shadow-md bg-white  min-h-[10rem] rounded p-10'>
						<div className='flex justify-start'>
							<div className='w-6/12'>
								<p>
									<label htmlFor='name' className='font-semibold'>
										Name:
									</label>
									&nbsp; &nbsp;
									<span id='name' className='underline'>
										{getWalletRecord?.personal_information.firstname} {getWalletRecord?.personal_information.midlename} {getWalletRecord?.personal_information.lastname}
									</span>
								</p>
								<p>
									<label htmlFor='bdate' className='font-semibold'>
										Birthdate:
									</label>
									&nbsp; &nbsp;
									<span id='bdate' className='underline'>
										{moment(getWalletRecord?.personal_information.birthdate).format('MMMM / DD / YYYY')}
									</span>
								</p>
								<p>
									<label htmlFor='gender' className='font-semibold'>
										Sex:
									</label>
									&nbsp; &nbsp;
									<span id='gender' className='underline'>
										{startCase(getWalletRecord?.personal_information.gender)}
									</span>
								</p>
								<p>
									<label htmlFor='age' className='font-semibold'>
										Age:
									</label>{' '}
									&nbsp; &nbsp;
									<span id='age' className='underline'>
										{getWalletRecord?.personal_information.age}
									</span>
								</p>
								<p>
									<label htmlFor='nationality' className='font-semibold'>
										Nationality:
									</label>{' '}
									&nbsp; &nbsp;
									<span id='nationality' className='underline'>
										{getWalletRecord?.personal_information.nationality}
									</span>
								</p>
							</div>

							<div>
								<p>
									<label htmlFor='addr' className='font-semibold'>
										Address:
									</label>{' '}
									&nbsp; &nbsp;
									<span id='addr' className='underline'>
										{getWalletRecord?.personal_information.address}
									</span>
								</p>
								<p>
									<label htmlFor='mb' className='font-semibold'>
										Mobile Numbeer:
									</label>{' '}
									<span id='mb' className='underline'>
										{getWalletRecord?.personal_information.mobileNumber}
									</span>
								</p>
								<p>
									<label htmlFor='pcode' className='font-semibold'>
										Postal code:
									</label>{' '}
									&nbsp; &nbsp;
									<span id='pcode' className='underline'>
										{getWalletRecord?.personal_information.postal_code}
									</span>
								</p>
								<p>
									<label htmlFor='reg_date' className='font-semibold'>
										Register date:
									</label>{' '}
									&nbsp; &nbsp;
									<span id='reg_date' className='underline'>
										{moment(getWalletRecord?.personal_information.createdAt).format('MMMM  DD,  YYYY')}
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* end personal information */}
				</div>
			</div>
		</>
	);
}

export default withAdminWrapper(WalletIDAccount);
