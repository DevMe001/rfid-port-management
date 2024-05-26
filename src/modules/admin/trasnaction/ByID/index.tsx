import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import withAdminWrapper from '../../component/admin-wrapper';
import { DashboardHeader } from '../../../../common/components/ui/main.ui.component';
import Breadcrumbs from '../../component/Breadcrumbs';
import CustomButton from '../../../../common/components/ui/button.componetnt';
import { FaRegFilePdf } from 'react-icons/fa6';
import { GrPrint } from 'react-icons/gr';
import { TransactionPaymentRecord, useGetTransactionByIdQuery } from '../../../../api-query/transaction.api.services';
import moment from 'moment';
import { isEmpty, startCase } from 'lodash';
import { useGetPassengerByMultipleIdQuery } from '../../../../api-query/passengerapi-service';
import PrintComponent from '../invoice-individual';
import RenderIf from '../../../../common/components/ui/render-if';
import { Passenger } from '../../../../api-query/types';
import usePrintFunc from '../../../../utils/hooks/usePrintFunc';
import { jsPDF } from 'jspdf';
import PrintExportComponent from '../invoice-individual/export-file';

const TransactionDetailsPerBooking = () => {

const params = useParams();

const { data: getTransactionRecord, isError, error } = useGetTransactionByIdQuery(params.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });
const navigate = useNavigate();

const { data: getPassengerAssociated } = useGetPassengerByMultipleIdQuery(getTransactionRecord?.booking.passengers as string,{pollingInterval:3000,refetchOnMountOrArgChange:true,skip:false});

const { componentRef,exportRef, handlePrint } = usePrintFunc();


const createDownloadablePDF = () => {
	const doc = new jsPDF({
		orientation: 'landscape',
		format: [1280, 800],
		unit: 'px', // Use pixels for margins
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: 0,
	});

	// Create a temporary div to hold the HTML content

	let tempDiv = exportRef.current;

	doc.html(tempDiv, {
		callback: function (doc) {
			doc.save('invoice.pdf');
		},
		x: 0,
		y: 0,
	});
};


useEffect(()=>{
	if(isError){
		console.log(error);
		navigate('admin-dashboard/transaction');
	}
},[])


  return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Transaction' activeLink={`${params.id}`} />

				{/* wrapper */}

				<div className='flex flex-col p-10 w-full h-full'>
					<div className='flex justify-between'>
						<h2 className='text-2xl text-accent'>
							<label htmlFor='refNUmber'>Reference #:</label>{' '}
							<span className='ml-2' id='refNUmber'>
								{params.id}
							</span>
						</h2>

						<div>
							<CustomButton
								onClick={createDownloadablePDF}
								label={
									<p className='flex gap-2 items-center'>
										<FaRegFilePdf />
										<span>Export PDF</span>
									</p>
								}
							/>
							&nbsp; &nbsp;
							<CustomButton
								onClick={handlePrint}
								label={
									<p className='flex gap-2 items-center'>
										<GrPrint />
										<span>Print</span>
									</p>
								}
							/>
						</div>
					</div>

					<div className='flex justify-between mt-10 leading-7'>
						<div className='w-7/12  bg-white pt-5 py-10 pr-8 pl-5 shadow-md my-1  rounded-md'>
							<p className='flex'>
								<label htmlFor='name' className='font-semibold w-4/12'>
									Account Name:
								</label>{' '}
								<span id='name' className='underline'>
									{getTransactionRecord?.personal_information?.firstname} {getTransactionRecord?.personal_information?.midlename} {getTransactionRecord?.personal_information?.lastname}
								</span>
							</p>
							<p className='flex'>
								<label htmlFor='name' className='font-semibold w-4/12'>
									Account Number:
								</label>{' '}
								<span id='name' className='underline'>
									{getTransactionRecord?.wallet.account_number}
								</span>
							</p>

							<p className='flex'>
								<label htmlFor='name' className='font-semibold w-4/12'>
									Mobile Number:
								</label>{' '}
								<span id='name' className='underline'>
									{getTransactionRecord?.personal_information.mobileNumber}
								</span>
							</p>

							<p className='flex'>
								<label htmlFor='name' className='font-semibold w-4/12'>
									Address:
								</label>{' '}
								<span id='name' className='underline'>
									{getTransactionRecord?.personal_information.address}
								</span>
							</p>

							<p className='flex'>
								<label htmlFor='name' className='font-semibold w-4/12'>
									Transaction date:
								</label>{' '}
								<span id='name' className='underline'>
									{moment(getTransactionRecord?.createdAt).format('MMM DD, YYYY')}
								</span>
							</p>
						</div>

						<div className='pr-10'>
							<p>
								<label htmlFor='name' className='font-semibold'>
									Status:
								</label>{' '}
								<span id='name' className='underline'>
									{startCase(getTransactionRecord?.booking.status)}
								</span>
							</p>
						</div>
					</div>

					{/* Booking process */}
					<div className='flex gap-10 mt-10 leading-10'>
						<div className='shadow-md pr-10 pl-5 py-5 bg-white w-8/12 rounded-md'>
							<h2>
								<label htmlFor='bookId'>Book #:</label> <span>{getTransactionRecord?.book_id}</span>
							</h2>

							<div className='flex justify-between'>
								<p>
									<label htmlFor='vehicleName' className='font-semibold'>
										Vehicle Name:
									</label>{' '}
									<span id='vehicleName' className='underline'>
										{getTransactionRecord?.booking.schedule.vehicle.vehicle_name}
									</span>
								</p>
								<p>
									<label htmlFor='vehicleType' className='font-semibold'>
										Vehicle Type:
									</label>{' '}
									<span id='vehicleType' className='underline'>
										{getTransactionRecord?.booking.schedule.vehicle.vehicle_type}
									</span>
								</p>
							</div>

							<div className='flex justify-between'>
								<p>
									<label htmlFor='orign' className='font-semibold'>
										Origin:
									</label>{' '}
									<span id='orign' className='underline'>
										{getTransactionRecord?.booking.schedule.origin}
									</span>
								</p>
								<p>
									<label htmlFor='destn' className='font-semibold'>
										Destination:
									</label>{' '}
									<span id='destn' className='underline'>
										{getTransactionRecord?.booking.schedule.destination}
									</span>
								</p>
							</div>

							<div className='flex justify-between'>
								<p>
									<label htmlFor='passengerNum' className='font-semibold'>
										# of Passengers:
									</label>{' '}
									<span id='passengerNum' className='underline'>
										{getTransactionRecord?.booking.passengers.split(',').length ?? 0}
									</span>
								</p>
								<p>
									<label htmlFor='amt' className='font-semibold'>
										Total Amount:
									</label>{' '}
									<span id='amt' className='underline'>
										&#8369; {Number(getTransactionRecord?.booking.amount).toFixed(2)}
									</span>
								</p>
							</div>

							<div className='flex justify-between'>
								<p>
									<label htmlFor='vehicleNum' className='font-semibold'>
										# of Vehicle:
									</label>{' '}
									<span id='vehicleNum' className='underline'>
										1
									</span>
								</p>
								<p>
									<label htmlFor='dateSched' className='font-semibold'>
										Date sched.:
									</label>{' '}
									<span id='dateSched' className='underline'>
										May 20, 2024 at & 7am
									</span>
								</p>
							</div>

							<div className='flex flex-col'>
								<label htmlFor='orign' className='font-semibold'>
									Name of Passengers
								</label>

								{!isEmpty(getPassengerAssociated) &&
									getPassengerAssociated?.map((passenger) => (
										<p key={passenger.passenger_id} className='flex justify-between'>
											<label htmlFor='reg' className='font-semibold'>
												{passenger.firstname} {passenger.lastname} ({passenger.fare_type})
											</label>{' '}
											<span id='reg'>₱ {passenger.booking_amount}</span>
										</p>
									))}
							</div>
						</div>

						{/* end booking */}

						{/* payment history */}
						<div className='bg-white px-10 py-5 w-4/12'>
							<h2 className='font-semibold text-center'>Payment History</h2>

							<p className='flex justify-between'>
								<label htmlFor='wb' className='font-semibold'>
									Wallet balance
								</label>{' '}
								<span id='wb'> ₱ {getTransactionRecord?.payment_history.wallet_balance}</span>
							</p>

							<p className='flex justify-between'>
								<label htmlFor='deduc' className='font-semibold'>
									Deduction
								</label>{' '}
								<span id='deduc'>₱ {getTransactionRecord?.payment_history.booking_amount}</span>
							</p>

							<p className='flex justify-between'>
								<label htmlFor='cb' className='font-semibold'>
									Current balance
								</label>{' '}
								<span id='cb'>₱ {getTransactionRecord?.payment_history.current_balance}</span>
							</p>

							<p className='flex justify-between'>
								<label htmlFor='dateIssue' className='font-semibold'>
									Date issued
								</label>{' '}
								<span id='dateIssue'>{moment(getTransactionRecord?.payment_history.createdAt).format('MMM DD, YYYY')}</span>
							</p>

							<p className='flex justify-between'>
								<label htmlFor='via' className='font-semibold'>
									Paid via
								</label>{' '}
								<span id='via'>{getTransactionRecord?.payment_history.payment_type}</span>
							</p>
						</div>

						{/* end payment hostiry */}
					</div>

					{/* end  */}
				</div>

				{/* end wrapper */}
			</div>
			<RenderIf value={!isEmpty(getTransactionRecord)}>
				<PrintComponent componentRef={componentRef} data={getTransactionRecord as TransactionPaymentRecord} passengers={getPassengerAssociated as Passenger[]} />
				<PrintExportComponent componentRef={exportRef} data={getTransactionRecord as TransactionPaymentRecord} passengers={getPassengerAssociated as Passenger[]} />
			</RenderIf>
		</>
	);
}

export default withAdminWrapper(TransactionDetailsPerBooking)
