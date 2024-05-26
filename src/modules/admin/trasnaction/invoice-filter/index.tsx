import React  from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'flowbite-react';
import moment from 'moment';
import { QueryResultTypeTransaction, useFilterTransactionListByDateMutation } from '../../../../api-query/transaction.api.services';
import { TbFilterSearch } from 'react-icons/tb';
import { getStartEndDateObject } from '../../../../utils/hooks/globa.state';

export type FilterDateProps = {
	startDate: string;
	endDate: string;
};


  const formSchema = Yup.object().shape({
		startDate: Yup.date()
			.required('Start date is required')
			.test('startDateBeforeEndDate', 'Start date cannot be greater than end date', function (value) {
				const { endDate } = this.parent;
				return !endDate || !value || value <= endDate;
			}),
		endDate: Yup.date()
			.required('End date is required')
			.test('endDateAfterStartDate', 'End date cannot be less than start date', function (value) {
				const { startDate } = this.parent;
				return !startDate || !value || value >= startDate;
			}),
	});



type Props = {
	setFilterDataByDate: React.Dispatch<React.SetStateAction<Partial<QueryResultTypeTransaction> | undefined>>;
};


const InvoiceFilterByDate: React.FC<Props> = ({setFilterDataByDate}) => {
	const [filterTransactionListBydate] = useFilterTransactionListByDateMutation();

	const [,setDate] = getStartEndDateObject();

	const initialValues: FilterDateProps = {
		startDate: '',
		endDate: '',
	};



	const formik = useFormik({
		initialValues,
		validationSchema: formSchema,
		onSubmit: async (values) => {
			// Handle form submission
			console.log(values);
		

			// const startDateFormat = moment(values.startDate).format('YYYY-MM-DD HH:mm:ss.SSS');
			// const endDateFormat = moment(values.endDate).format('YYYY-MM-DD HH:mm:ss.SSS');
			
			// console.log(startDateFormat);
			// console.log(endDateFormat);

			const res = await filterTransactionListBydate({ startDate: values.startDate, endDate: values.endDate });

			console.log(res,'get res')

			if ('data' in res) {
				console.log(res.data, 'get res');
					setDate(values);
				setFilterDataByDate(res.data);
			
				
			}
		},
	});

	return (
		<>
			<form className='flex flex-col gap-2 w-[20rem]' onSubmit={formik.handleSubmit}>
				<h2 className='text-xl text-center font-semibold'>Print by date</h2>
				<div>
					<label className='font-medium' htmlFor='startDate'>
						Start Date
					</label>
					<TextInput id='startDate' name='startDate' type='datetime-local' onChange={formik.handleChange} value={formik.values.startDate} />
					{formik.errors.startDate ? <div className='font-medium text-red-800'>{formik.errors.startDate}</div> : null}
				</div>
				<div>
					<label className='font-medium' htmlFor='endDate'>
						End Date
					</label>
					<TextInput id='endDate' name='endDate' type='datetime-local' onChange={formik.handleChange} value={formik.values.endDate} />
					{formik.errors.endDate ? <div className='font-medium text-red-800'>{formik.errors.endDate}</div> : null}
				</div>
				<button className='flex gap-1 items-center justify-center bg-accent text-white' type='submit'>
					<span>Filter</span> <TbFilterSearch />
				</button>
			</form>
		
		</>
	);
};

export default InvoiceFilterByDate;
