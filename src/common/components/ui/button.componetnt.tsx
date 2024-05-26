import { Interpolation, Theme } from '@emotion/react';
import clsx from 'clsx';
import React, { ComponentProps } from 'react'


type ButtonProps = {
	label: string | React.ReactNode;
	css?: Interpolation<Theme>;
	className?:string;
} & ComponentProps<'button'>;

const CustomButton: React.FC<ButtonProps> = ({ label,className,...props}) => {
	return (
		<button className={clsx('btn bg-accent text-white outline-none border-none focus:outline-none',className)} type='submit' {...props}>
			{label}
		</button>
	);
};

export default CustomButton;
