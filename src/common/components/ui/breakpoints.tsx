import React, { ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

export enum Sizes {
	xss,
	xs,
	sm,
	md,
	lg,
}

export enum Display {
	none,
	flex,
	block,
	inline,
}

type Breakpoint = {
	sx: Sizes[];
	display: Display;
	children: React.ReactNode;
} & ComponentPropsWithRef<'div'>; // Define additional div props

const ScreenWidth: React.FC<Breakpoint> = ({ sx, display, children, ...props }) => {
	const breakpointClass = sx
		.map((size) => {
			switch (size) {
				case Sizes.xss:
					return `hidden ${size}:${display}`;
				case Sizes.xs:
					return `hidden ${size}:${display}`;
				case Sizes.sm:
					return `hidden ${size}:${display}`;
				case Sizes.md:
					return `hidden ${size}:${display}`;
				case Sizes.lg:
					return `hidden ${size}:${display}`;
				default:
					return '';
			}
		})
		.join(' ');

	const displayClass = display === Display.none ? 'hidden' : display;

	return (
		<div className={clsx(breakpointClass, displayClass)} {...props}>
			{children}
		</div>
	);
};

export default ScreenWidth;
