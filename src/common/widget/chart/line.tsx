import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGetTotalSalesQuery, TransactionWithTotalsSales } from '../../../api-query/transaction.api.services';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			grid: {
				display: false,
			},
		},
		y: {
			grid: {
				display: false,
			},
		},
	},
	plugins: {
		legend: {
			position: 'top' as const,
		},
		title: {
			display: true,
			text: 'SALES REPORT',
		},
	},
};

const labels = ['Day', 'Week', 'Month', 'Year']; 
export function LineChart() {
	const { data: salesCount } = useGetTotalSalesQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	console.log(salesCount, 'get count');

	const dataSet: TransactionWithTotalsSales = (salesCount as unknown as TransactionWithTotalsSales) ?? { today: [], week: [], month: [], year: [] };

// const dayData = dataSet.today.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
// const weekData = dataSet.week.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
// const monthData = dataSet.month.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
// const yearData = dataSet.year.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);

const dayData = dataSet.today.map((entry) => entry.booking_amount ?? 0);
const weekData = dataSet.week.map((entry) => entry.booking_amount ?? 0);
const monthData = dataSet.month.map((entry) => entry.booking_amount ?? 0);
const yearData = dataSet.year.map((entry) => entry.booking_amount ?? 0);


const data = {
	labels,
	datasets: [
		{
			label: 'day',
			data: dayData, // Wrap dayData in an array
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		},
		{
			label: 'week',
			data: weekData, // Wrap weekData in an array
			borderColor: 'rgb(255, 159, 64)',
			backgroundColor: 'rgba(255, 159, 64, 0.5)',
		},
		{
			label: 'month',
			data: monthData, // Wrap monthData in an array
			borderColor: 'rgb(75, 192, 192)',
			backgroundColor: 'rgba(75, 192, 192, 0.5)',
		},
		{
			label: 'year',
			data: yearData, // Wrap yearData in an array
			borderColor: 'rgb(153, 102, 255)',
			backgroundColor: 'rgba(153, 102, 255, 0.5)',
		},
	],
};

	return (
		<div className='p-5' style={{ width: '100%', maxWidth: '100%', margin: '0' }}>
			{/* Chart container */}
			<div style={{ width: '100%', height: '400px' }}>
				<Line data={data} options={options} />
			</div>
		</div>
	);
}
