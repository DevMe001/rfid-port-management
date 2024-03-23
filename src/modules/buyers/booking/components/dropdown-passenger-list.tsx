import React from 'react'
import { FiMinusCircle } from 'react-icons/fi';
import { IoAddCircleOutline } from 'react-icons/io5';

type PassengerProps = {
	label: string;
	count: number;
	onDecrement: () => void;
	onIncrement: () => void;
};


const PassengerMenuList: React.FC<PassengerProps> = ({ label, count, onDecrement, onIncrement }) => {
	return (
		<div className='flex justify-between items-center'>
			<div className='w-6/12'>{label}</div>
			<div className='flex justify-between w-6/12'>
				<FiMinusCircle onClick={onDecrement} />
				<span className='font-medium'>{count}</span>
				<IoAddCircleOutline onClick={onIncrement} />
			</div>
		</div>
	);
};

export default PassengerMenuList
