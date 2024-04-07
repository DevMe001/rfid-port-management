import React from 'react';

type RenderIfProps = {
	value: string | boolean | number | Record<string, any> | [];
	children: React.ReactNode;
};

export const RenderElement: React.FC<RenderIfProps> = ({ value, children }) => {
	return value ? <>{children}</> : null;
};

type RenderElseProps = {
	children: React.ReactNode;
};

export const Else: React.FC<RenderElseProps> = ({ children }) => {
	return <>{children}</>;
};
