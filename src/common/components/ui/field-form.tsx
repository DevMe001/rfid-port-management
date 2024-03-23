import { Interpolation, Theme } from '@emotion/react';
import clsx from 'clsx';
import { ErrorMessage, Field } from 'formik';
import React, { ComponentProps } from 'react';
import RenderIf from './render-if';
import { isEmpty } from 'lodash';

type InputProps = {
	labelName?: string;
	identifyAs: string;
  labelClassName?:string;
  inputClassName?:string;
  type?:string;
  inputAssign?:string;
  fieldName:string;
	css?: Interpolation<Theme>;
} & ComponentProps<'label'> &
	ComponentProps<'input'>;


const InputFieldForm: React.FC<InputProps> = ({ labelName, identifyAs, fieldName, type, inputAssign,labelClassName, inputClassName, ...props }) => {
	const { ...labelProps } = props; // Destructure label props
	const { ...inputProps } = props; // Destructure input props

	const identityName = `${identifyAs}.${fieldName}`;
	return (
		<div className='leading-10'>
			<RenderIf value={!isEmpty(labelName)}>
				<label htmlFor={identityName} className={clsx('font-medium text-navy', labelClassName)} {...labelProps}>
					{labelName}
				</label>
				<Field type={type} as={inputAssign} id={identityName} name={identityName} className={clsx('borderGray h-[2.5rem] w-full rounded placeholder:pl-5', inputClassName)} {...inputProps} />
				<ErrorMessage
					name={identityName}
					render={(msg) => (
						<div style={{ color: '#f10000' }} className='error'>
							{msg}
						</div>
					)}
				/>
			</RenderIf>
			<RenderIf value={isEmpty(labelName)}>
				<Field type={type} as={inputAssign} id={identityName} name={identityName} className={clsx('borderGray h-[2.5rem] w-full rounded placeholder:pl-2', inputClassName)} {...inputProps} />
			</RenderIf>
		</div>
	);
};

export default InputFieldForm
