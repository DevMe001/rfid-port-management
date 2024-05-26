import React from 'react';
import { TransactionPaymentRecord } from '../../../../api-query/transaction.api.services';
import moment from 'moment';
import { isEmpty, startCase } from 'lodash';
import { Passenger } from '../../../../api-query/types';
import withPrintDocument from '../../component/print-wrapper';

type Props = {
	componentRef: React.RefObject<HTMLDivElement> | null;
	data: TransactionPaymentRecord;
	passengers: Passenger[];
};

const PrintComponent: React.FC<Props> = ({ componentRef, data, passengers }) => {
	return (
		<div className='printRecord'>
			{/* Your component to be printed */}
			<div ref={componentRef} className='flex flex-col w-full h-full rounded-md min-h-[50rem] mt-10'>
				{/* title */}
				<section className='flex justify-between pb-4 border-b border-black'>
					<p className='flex gap-1'>
						<label htmlFor='report_id' className='font-semibold'>
							Transaction Detail Reports:
						</label>
						<span id='report_id'>{data.transaction_id}</span>
					</p>
					<p className='flex gap-1'>
						<label htmlFor='dateIssued' className='font-semibold'>
							Date issued:
						</label>
						<span id='dateIssued'>{moment(data.createdAt).format('MMM DD, YYYY')}</span>
					</p>
				</section>

				<p className='font-semibold  text-xl mt-10'>Personal Information</p>
				<div style={{ borderBottom: '1px solid #000' }} className='w-full h-full mb-5'></div>

				<section className='flex flex-col justify-between pb-4 border-b border-black'>
					<p className='flex gap-2'>
						<label htmlFor='report_id' className='font-semibold'>
							Fullname:
						</label>
						<span id='report_id'>
							{data.personal_information.firstname} {data.personal_information.lastname}
						</span>
					</p>
					<p className='flex gap-2'>
						<label htmlFor='dateIssued' className='font-semibold'>
							Account number:
						</label>
						<span id='report_id'>{data.wallet.account_number}</span>
					</p>
					<p className='flex gap-2'>
						<label htmlFor='dateIssued' className='font-semibold'>
							Mobile number:
						</label>
						<span id='report_id'>{data.personal_information.mobileNumber}</span>
					</p>

					<p className='flex gap-2'>
						<label htmlFor='addr' className='font-semibold'>
							Address:
						</label>
						<span id='addr'>
							{data.personal_information.address} (<strong>{data.personal_information.postal_code}</strong>)
						</span>
					</p>
				</section>

				<p className='font-semibold  text-xl mt-10'>Booking Scheduled</p>
				<div style={{ borderBottom: '1px solid #000' }} className='w-full h-full'></div>

				<table className='table-auto w-full h-full mt-5  border-b border-black'>
					{/* booking record */}
					<thead>
						<tr>
							<th>Book id</th>
							<th>Vehicle name</th>
							<th>Vehicle type</th>
							<th>Origin</th>
							<th>Destination</th>
							<th>Passengers</th>
							<th>Amount</th>
							<th>Date of arrival</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody className='mt-10'>
						{/* booking record */}

						<tr>
							<td className='text-center py-4'>{data.book_id.slice(0, 12)}</td>
							<td className='text-center py-4'>{data.booking.schedule.vehicle.vehicle_name}</td>
							<td className='text-center py-4'>{data.booking.schedule.vehicle.vehicle_type}</td>
							<td className='text-center py-4'>{data.booking.schedule.origin}</td>
							<td className='text-center py-4'>{data.booking.schedule.destination}</td>
							<td className='text-center py-4'>{data.booking.passengers.split(',').length ?? 0}</td>
							<td className='text-center py-4'>{data.booking.amount}</td>
							<td className='text-center py-4'>
								{moment(data.booking.schedule.arrival_date).format('MMM DD, YYYY')} at {data.booking.schedule.arrival_time}
							</td>
							<td className='text-center py-4'>{startCase(data.booking.status)}</td>
						</tr>

						{/* end booking  body*/}
					</tbody>

					{/* end booking header*/}
				</table>

				<section className='mt-5 py-5  border-b border-black'>
					<p className='font-semibold  text-xl'>Name of passengers</p>
					<div style={{ borderBottom: '1px solid #000' }} className='w-full h-full'></div>

					<div className='leading-12 my-4'>
						{!isEmpty(passengers) &&
							passengers.map((passenger) => (
								<p className='flex gap-10' key={passenger.passenger_id}>
									<span>
										{passenger.firstname} {passenger.lastname} (<strong>{passenger.fare_type}</strong>)
									</span>
									<span>₱ {passenger.booking_amount}</span>
								</p>
							))}
					</div>
				</section>

				<section className='flex justify-end'>
					<div className='flex flex-col'>
						<p className='font-semibold text-xl my-2'>Payment history</p>

						<div className='leading-20'>
							<p>
								<strong>Wallet balance:</strong> &#8369; {data.payment_history.wallet_balance.toFixed(2)}
							</p>
							<p style={{ borderBottom: '1px solid #000' }}>
								<strong>Deduction:</strong> &#8369; {data.payment_history.booking_amount.toFixed(2)}
							</p>
							<p>
								<strong>Current balance:</strong> &#8369; {data.payment_history.current_balance.toFixed(2)}
							</p>
							<p className='mt-2'>
								<strong>Date issued:</strong> {moment(data.payment_history.createdAt).format('MMM DD, YYYY')}
							</p>
						</div>
					</div>
				</section>

				{/* end title */}
			</div>
		</div>
	);
};

export default withPrintDocument(PrintComponent);
