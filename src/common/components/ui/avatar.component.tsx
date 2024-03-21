import { Interpolation, Theme } from '@emotion/react';
import clsx from 'clsx';
import { isUndefined } from 'lodash';
import React, { ComponentProps } from 'react';


type ImageCircleRound = {
	label: string | number ;
	css?: Interpolation<Theme>;
} & ComponentProps<'div'>

const ImageCircleRound: React.FC<ImageCircleRound> = ({ label, className,...props }) => {
	return (
		<div
			className={clsx('uppercase bg-accent rounded-full flex justify-center items-center text-white text-3xl', {
				'w-[8rem]': isUndefined(className),
				'h-[8rem]': isUndefined(className),
			},className)}
			{...props}
		>
			{label}
		</div>
	);
};

export default ImageCircleRound;
