import React, { useMemo } from 'react'
import withPrintDocument from '../../component/print-wrapper'
import { QueryResultTypeTransaction, TransactionPaymentRecord } from '../../../../api-query/transaction.api.services';
import moment from 'moment';
import { isEmpty, startCase } from 'lodash';
import { getStartEndDateObject } from '../../../../utils/hooks/globa.state';
import RenderIf from '../../../../common/components/ui/render-if';
import clsx from 'clsx';

type Props = {
	componentRef: React.RefObject<HTMLDivElement> | null;
	data: QueryResultTypeTransaction;
};


const PrintAllInvoiceDetails: React.FC<Props> = ({ componentRef, data }) => {


	console.log(data)

	const getData = data as unknown as TransactionPaymentRecord[];

		const [transactionDate] = getStartEndDateObject();



const getTotalSales = useMemo(() => getData.reduce((acc, cur) => acc + cur.payment_history.booking_amount, 0), [data]);


	return (
		<div className='printRecord'>
			<div ref={componentRef} className='flex flex-col w-full h-full rounded-md min-h-[50rem] mt-10'>
				<section
					className={clsx('flex justify-between ', {
						'pb-4 border-b border-black': isEmpty(transactionDate.startDate) && isEmpty(transactionDate.endDate),
					})}
				>
					<p className='flex gap-1'>
						<label htmlFor='report_id' className='font-semibold'>
							Transaction Sales Reports:
						</label>
					</p>
					<p className='flex gap-1'>
						<label htmlFor='dateIssued' className='font-semibold'>
							Date issued:
						</label>
						<span id='dateIssued'>{moment(new Date()).format('MMM DD, YYYY')}</span>
					</p>
				</section>
				<RenderIf value={!isEmpty(transactionDate.startDate) && !isEmpty(transactionDate.endDate)}>
					<section
						className={clsx('flex justify-between ', {
							'pb-4 border-b border-black': !isEmpty(transactionDate.startDate) && !isEmpty(transactionDate.endDate),
						})}
					>
						<p className='flex gap-1'>
							<label htmlFor='dateIssued' className='font-semibold'>
								Filtered date:
							</label>
							<span id='dateIssued'>
								{moment(transactionDate.startDate).format('MMM DD, YYYY')} - {moment(transactionDate.endDate).format('MMM DD, YYYY')}
							</span>
						</p>
					</section>
				</RenderIf>
				{!isEmpty(data) && (
					<table className='table-auto w-full h-full mt-5  border-b border-black'>
						{/* booking record */}
						<thead>
							<tr>
								<th>Reference #</th>
								<th>Book Assigned</th>
								<th>Passenger ID</th>
								<th>Account #</th>
								<th>Vehicle</th>
								<th>Wallet fund</th>
								<th>Booking amount</th>
								<th>Balance</th>
								<th>Route</th>
								<th>Date issued</th>
								<th>Status</th>
							</tr>
						</thead>

						{!isEmpty(getData) &&
							getData?.map((transaction: TransactionPaymentRecord) => (
								<tbody key={transaction.transaction_id} className='mt-10'>
									{/* booking record */}

									<tr>
										<td className='text-center py-4'>{transaction.transaction_id.slice(0, 12)}</td>
										<td className='text-center py-4'>
											{transaction.personal_information.firstname} {transaction.personal_information.lastname}
										</td>
										<td className='text-center py-4'>{transaction.payment_history.passenger_id}</td>
										<td className='text-center py-4'>{transaction.wallet.account_number}</td>
										<td className='text-center py-4'>{transaction.booking.schedule.vehicle.vehicle_name}</td>
										<td className='text-center py-4'> &#8369; &nbsp;{transaction.payment_history.wallet_balance}</td>
										<td className='text-center py-4'> &#8369; ;&nbsp;{transaction.payment_history.booking_amount}</td>
										<td className='text-center py-4'> &#8369; &nbsp;{transaction.payment_history.current_balance}</td>
										<td className='text-center py-4'>
											<strong>{transaction.booking.schedule.origin}</strong> - <strong>{transaction.booking.schedule.destination}</strong>
										</td>
										<td className='text-center py-4'>{moment(transaction.payment_history.createdAt).format('MMM DD, YYYY')}</td>
										<td className='text-center py-4'>{startCase(transaction.booking.status)}</td>
									</tr>

									{/* end booking  body*/}
								</tbody>
							))}
						{/* end booking header*/}
					</table>
				)}

				<section className='flex justify-end my-10'>
					<div className='flex flex-col'>
						<div className='leading-20'>
							<p>
								<strong>Total Sales:</strong> &#8369; {getTotalSales.toFixed(2)}
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default withPrintDocument(PrintAllInvoiceDetails);
