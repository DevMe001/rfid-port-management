
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useGetTransactionCountAllQuery, TransctionCount } from '../../../api-query/transaction.api.services';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
	responsive: true, // Make the chart responsive
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'top' as const,
		},
		title: {
			display: true,
			text: 'Total Counts',
			font: { size: 25 },
		},
	},
};


export function PieChart() {


			const { data: dashboardCount } = useGetTransactionCountAllQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

			const dataSet: TransctionCount = (dashboardCount as unknown as TransctionCount) ?? 0;

		const data = {
			labels: ['Booking', 'Schedule', 'RFID Slot', 'Vehicle', 'Users', 'Passengers', 'Accounts'],
			datasets: [
				{
					label: '# of Counts',
					data: [dataSet.booking, dataSet.schedule, dataSet.rfid, dataSet.vehicle, dataSet.user, dataSet.passengers, dataSet.account],
					backgroundColor: [
						'rgba(54, 162, 235, 0.2)', // Blue
						'rgba(255, 99, 132, 0.2)', // Red
						'rgba(255, 159, 64, 0.2)', // Orange
						'rgba(75, 192, 192, 0.2)', // Teal
						'rgba(153, 102, 255, 0.2)', // Purple
						'rgba(255, 205, 86, 0.2)', // Yellow
						'rgba(201, 203, 207, 0.2)', // Grey
					],
					borderColor: [
						'rgba(54, 162, 235, 1)', // Blue
						'rgba(255, 99, 132, 1)', // Red
						'rgba(255, 159, 64, 1)', // Orange
						'rgba(75, 192, 192, 1)', // Teal
						'rgba(153, 102, 255, 1)', // Purple
						'rgba(255, 205, 86, 1)', // Yellow
						'rgba(201, 203, 207, 1)', // Grey
					],
					borderWidth: 2,
				},
			],
		};

	return (
		<div className='p-5' style={{ width: '100%', maxWidth: '100%', margin: '0 auto', height: '100%' }}>
			{/* Chart container */}
			<div className='bg-white rounded p-5' style={{ width: '100%', height: '100%' }}>
				<Pie data={data} options={options} />
			</div>
		</div>
	);
}
