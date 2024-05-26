import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGetTotalSalesQuery, TransactionWithTotalsSales } from '../../../api-query/transaction.api.services';
import {  isEmpty, startCase } from 'lodash';
import moment from 'moment';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const labels = ['Day', 'Week', 'Monthly', 'Year']; 
export function LineChart() {
	const { data: salesCount } = useGetTotalSalesQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	 console.log(salesCount, 'get count');

	const dataSet: TransactionWithTotalsSales = (salesCount as unknown as TransactionWithTotalsSales) ?? { day: [], week: [], monthly: [], year: [] };

	// const dayData = dataSet.today.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
	// const weekData = dataSet.week.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
	// const monthData = dataSet.month.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);
	// const yearData = dataSet.year.reduce((total, entry) => total + (entry.booking_amount ?? 0), 0);

	const dayData = dataSet.day.map((entry) => entry.booking_amount ?? 0);
	const weekData = dataSet.week.map((entry) => entry.booking_amount ?? 0);
	const monthData = dataSet.monthly.map((entry) => entry.booking_amount ?? 0);
	const yearData = dataSet.year.map((entry) => entry.booking_amount ?? 0);


const [{ isDay, isWeek, isMonth, isYear }, setHiddenGraph] = useState<{
	isDay: boolean;
	isMonth: boolean;
	isWeek: boolean;
	isYear: boolean;
}>({
	isDay: false,
	isMonth:  false,
	isWeek: false,
	isYear: false,
});






let dataSetList = [
	{
		label: 'All',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
	},
	{
		label: 'Day',
		data: dayData, // Wrap dayData in an array
		borderColor: 'rgb(255, 99, 132)',
		backgroundColor: 'rgba(255, 99, 132, 0.5)',
		hidden: isDay,
	},
	{
		label: 'Week',
		data: weekData, // Wrap weekData in an array
		borderColor: 'rgb(255, 159, 64)',
		backgroundColor: 'rgba(255, 159, 64, 0.5)',
		hidden: isWeek,
	},
	{
		label: 'Monthly',
		data: monthData, // Wrap monthData in an array
		borderColor: 'rgb(75, 192, 192)',
		backgroundColor: 'rgba(75, 192, 192, 0.5)',
		hidden: isMonth,
	},
	{
		label: 'Year',
		data: yearData, // Wrap yearData in an array
		borderColor: 'rgb(153, 102, 255)',
		backgroundColor: 'rgba(153, 102, 255, 0.5)',
		hidden: isYear,
	},
];

	


	const data = {
		labels,
		datasets: dataSetList,
	};

	
const defaultLegendClickHandler = ChartJS.defaults.plugins.legend.onClick;

	// @ts-ignore
	const options = {
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
				// @ts-ignore
				onClick: (e, legendItem, legend) => {
			
					console.log('console 2', legendItem.text);

					let label = legendItem.text.toLowerCase();

					// @ts-ignore
					if (!isEmpty(dataSet[label])) {
						// @ts-ignore
						let weekData = dataSet[label];

						
						

					
								// @ts-ignore
								const formattedDates = weekData.map((element) => {
									const dateForNow = element.createdAt;

									let dateLbl = '';

									if (label == 'day') {
										dateLbl = moment.utc(moment(dateForNow).utc()).format('dddd');

										setHiddenGraph({ isDay: false, isWeek: true, isMonth: true, isYear: true });
									}
									if (label == 'week') {
										dateLbl = moment.utc(moment(dateForNow).utc()).format('MMM DD,YYYY');
										setHiddenGraph({ isDay: true, isWeek: false, isMonth: true, isYear: true });
									}
									if (label == 'monthly') {
										dateLbl = moment.utc(moment(dateForNow).utc()).format('MMM');
										setHiddenGraph({ isDay: true, isWeek: true, isMonth: false, isYear: true });
									}
									if (label == 'year') {
										dateLbl = moment.utc(moment(dateForNow).utc()).format('YYYY');
										setHiddenGraph({ isDay: true, isWeek: true, isMonth: true, isYear: false });
									}

									return dateLbl;
								});
							

						
								legend.chart.data.labels = formattedDates;

						legend.chart.update();

						// Update tooltips based on the new labels
						// @ts-ignore

						// Update the chart
					}else{
							if (label == 'all') {

								console.log(label)
								// @ts-ignore
								// Reset legend labels and show all datasets
								legend.chart.data.labels = ['Day', 'Week', 'Monthly', 'Year'];
								setHiddenGraph({ isDay: false, isWeek: false, isMonth: false, isYear: false });

					
							
							}
					}


				},
			},
			title: {
				display: true,
				text: 'SALES REPORT',
				font: { size: 25 },
			},

			tooltip: {
				callbacks: {
					title: function (context: any) {
						const dataIndex = context[0].dataIndex;
						const label = context[0].dataset.label.toLowerCase();
					
			
						// @ts-ignore
						const dateForNow = dataSet[label][dataIndex].createdAt;

						const formattedDate = moment.utc(moment(dateForNow).utc()).format('MMM DD,YYYY:hh:mm A');

						return `(${formattedDate})`;
					},
					label: function (context: { datasetIndex: any; dataIndex: any }) {
						// console.log('get context', context);

						const datasetIndex = context.datasetIndex;
						const dataIndex = context.dataIndex;
						const dataset = data.datasets[datasetIndex];
						const bookingAmount = dataset.data[dataIndex];

						const label = dataset.label.toLowerCase();

						// @ts-ignore
						if (dataSet && dataSet[label] && dataSet[label][dataIndex]) {
						
							if(label == 'year'){
								
									const totalBookingAmount = dataset.data.reduce((total: number, amount: number) => total + amount, 0);

									return [`${startCase(label)}`, `Booking Amount: ₱ ${bookingAmount}`, `Total Sales: ₱${totalBookingAmount}`];
							}else{
								// @ts-ignore
								const passengerId = dataSet[label][dataIndex].passenger_id;
								// @ts-ignore
								const totalBookingAmount = dataset.data.reduce((total: number, amount: number) => total + amount, 0);

								return [`${startCase(label)}`,`Passenger ID: ${passengerId}`, `Booking Amount: ₱ ${bookingAmount}`, `Total Sales: ₱${totalBookingAmount}`];
							}
						}
					},
				},
				displayColors: true,
				backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set background color
				titleFont: { size: 16 }, // Adjust title font size
				bodyFont: { size: 14 }, // Adjust body font size
				cornerRadius: 10, // Set corner radius
				padding: 10, // Set padding
				width: 200, // Set width
				height: 100, // Set height
			},
		},
	};

	return (
		<div className='p-5' style={{ width: '100%', maxWidth: '100%', margin: '0' }}>
			{/* Chart container */}
			<div style={{ width: '100%', height: '400px' }}>
				<Line data={data} options={options}  />
			</div>
		</div>
	);
}
