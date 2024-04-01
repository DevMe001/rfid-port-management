import React from 'react';
import { Datepicker, DatepickerProps } from 'flowbite-react'; // Corrected import
import { ErrorMessage, FieldProps, Field } from 'formik';

type Props = {
	name: string;
	onChange?: React.FormEventHandler<HTMLLabelElement> & React.ChangeEventHandler<HTMLInputElement>;
} & Omit<DatepickerProps, 'css'>; 


const CustomDatePicker: React.FC<Props> = ({ name}) => {


	return (
		<div className='form-control w-full max-w-xs'>
			<Field name={name}>{(fieldProps: FieldProps) => <Datepicker  defaultValue={fieldProps.field.value} onChange={(date) => fieldProps.form.setFieldValue(name, date)} color='info' id={name} required />}</Field>

			{/* <Datepicker {...props} name={name} defaultValue={field.value} onChange={onChange} /> */}
			<ErrorMessage
				name={name}
				render={(msg) => (
					<div style={{ color: '#f10000' }} className='error'>
						{msg}
					</div>
				)}
			/>
		</div>
	);
};

export default CustomDatePicker;
