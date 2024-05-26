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


const PrintExportComponent: React.FC<Props> = ({ componentRef, data, passengers }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxWidth: '900px',
				height: '100%',
				margin: '0 auto',
				borderRadius: '0.375rem' /* Assuming 6px */,
			}}
			className='printRecord'
		>
			{/* Your component to be printed */}
			<div
				ref={componentRef}
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					margin: '0 auto',

					borderRadius: '12px' /* Assuming 6px */,
				}}
			>
				{/* title */}
				<section
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						paddingBottom: '16px' /* Assuming 16px */,
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderBottomColor: '#000' /* Assuming black */,
					}}
				>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Transaction Detail Reports:</label>
						<span>{data.transaction_id}</span>
					</p>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Date issued:</label>
						<span>{moment(data.createdAt).format('MMM DD, YYYY')}</span>
					</p>
				</section>

				<p style={{ fontWeight: '600', fontSize: '20px', marginTop: '2.5rem' }}>Personal Information</p>
				<div
					style={{
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderBottomColor: '#000' /* Assuming black */,
						width: '100%',
						height: '100%',
						paddingBottom: '10px',
					}}
					className='w-full h-full mb-5'
				></div>

				<section
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						paddingBottom: '1rem' /* Assuming 16px */,
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderBottomColor: '#000' /* Assuming black */,
					}}
				>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Fullname:</label>
						<span>
							{data.personal_information.firstname} {data.personal_information.lastname}
						</span>
					</p>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Account number:</label>
						<span>{data.wallet.account_number}</span>
					</p>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Mobile number:</label>
						<span>{data.personal_information.mobileNumber}</span>
					</p>
					<p style={{ gap: '0.25rem' }}>
						<label style={{ fontWeight: '600' }}>Address:</label>
						<span>
							{data.personal_information.address} (<strong>{data.personal_information.postal_code}</strong>)
						</span>
					</p>
				</section>

				<p style={{ fontWeight: '600', fontSize: '20px', marginTop: '40px' }} className='font-semibold text-xl mt-10'>
					Booking Scheduled
				</p>
				<div
					style={{
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderBottomColor: '#000' /* Assuming black */,
						width: '100%',
						height: '100%',
						paddingBottom: '10px',
					}}
				></div>

				<table
					style={{
						width: 'auto',
						tableLayout: 'auto',
						marginTop: '20px' /* Assuming 20px */,
					}}
				>
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
						<tr>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.book_id.slice(0, 12)}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.schedule.vehicle.vehicle_name}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.schedule.vehicle.vehicle_type}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.schedule.origin}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.schedule.destination}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.passengers.split(',').length ?? 0}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{data.booking.amount}</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>
								{moment(data.booking.schedule.arrival_date).format('MMM DD, YYYY')} at {data.booking.schedule.arrival_time}
							</td>
							<td style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>{startCase(data.booking.status)}</td>
						</tr>
					</tbody>
				</table>

				<section
					style={{
						marginTop: '20px' /* Assuming 20px */,
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderBottomColor: '#000' /* Assuming black */,
						paddingBottom: '20px',
					}}
				>
					<p style={{ fontWeight: '600', fontSize: '20px' }}>Name of passengers</p>
					<div
						style={{
							borderBottomWidth: '1px',
							borderBottomStyle: 'solid',
							borderBottomColor: '#000' /* Assuming black */,
							width: '100%',
							height: '100%',
							paddingBottom: '10px',
						}}
					></div>

					<div className='leading-12 my-4'>
						{!isEmpty(passengers) &&
							passengers.map((passenger) => (
								<p style={{ gap: '20px' }} className='flex gap-10' key={passenger.passenger_id}>
									<span>
										{passenger.firstname} {passenger.lastname} (<strong>{passenger.fare_type}</strong>)
									</span>
									<span>900</span>
								</p>
							))}
					</div>
				</section>

				<section
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						marginTop: '20px' /* Assuming 20px */,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<p style={{ fontWeight: '600', fontSize: '20px', marginTop: '1rem', marginBottom: '1rem' }}>Payment history</p>

						<div
							style={{
								lineHeight: '20px' /* Assuming 20px */,
							}}
							className='leading-20'
						>
							<p>
								<strong>Wallet balance:</strong> P {data.payment_history.wallet_balance.toFixed(2)}
							</p>
							<p style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#000', paddingBottom: '10px' }}>
								<strong>Deduction:</strong> P {data.payment_history.booking_amount.toFixed(2)}
							</p>
							<p>
								<strong>Current balance:</strong> P {data.payment_history.current_balance.toFixed(2)}
							</p>
							<p className='mt-2'>
								<strong>Date issued:</strong> {moment(data.payment_history.createdAt).format('MMM DD, YYYY')}
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default withPrintDocument(PrintExportComponent);
