import { Interpolation, Theme } from '@emotion/react';
import clsx from 'clsx';
import { ErrorMessage, Field } from 'formik';
import React, { ComponentProps } from 'react';
import RenderIf from './render-if';
import { isEmpty } from 'lodash';

type InputProps = {
	labelName?: string;
  labelClassName?:string;
  inputClassName?:string;
  type?:string;
  inputAssign?:string;
  fieldName:string;
	css?: Interpolation<Theme>;
} & ComponentProps<'label'> &
	ComponentProps<'input'>;


const InputFieldFormInput: React.FC<InputProps> = ({ labelName, fieldName, type, inputAssign,labelClassName, inputClassName, ...props }) => {
	const { ...labelProps } = props; // Destructure label props
	const { ...inputProps } = props; // Destructure input props


	return (
		<div className='leading-10'>
			<RenderIf value={!isEmpty(labelName)}>
				<label htmlFor={fieldName} className={clsx('font-medium text-navy', labelClassName)} {...labelProps}>
					{labelName}
				</label>
				<Field type={type} as={inputAssign} id={fieldName} name={fieldName} className={clsx('borderGray h-[2.5rem] w-full rounded placeholder:pl-5', inputClassName)} {...inputProps} />
				<ErrorMessage
					name={fieldName}
					render={(msg) => (
						<div style={{ color: '#f10000' }} className='error'>
							{msg}
						</div>
					)}
				/>
			</RenderIf>
			<RenderIf value={isEmpty(labelName)}>
				<Field type={type} as={inputAssign} id={fieldName} name={fieldName} className={clsx('borderGray h-[2.5rem] w-full rounded placeholder:pl-2', inputClassName)} {...inputProps} />
			</RenderIf>
		</div>
	);
};

export default InputFieldFormInput;
