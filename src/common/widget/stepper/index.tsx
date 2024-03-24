import React from 'react';
import './styles/stepper.css'
import clsx from 'clsx';


const stepperList:string[]=[
  'Passenger',
  'Details',
  'Billing'
]




const Stepper: React.FC<{ isActive: boolean; index: number }> = ({ isActive, index }) => {

console.log(isActive);

console.log(index)

	return (
		<ol className='flex gap-2 w-full justify-evenly items-baseline mt-12'>
			{stepperList.map((list, i) => (
				<li
					key={i}
					className={clsx('mr-8', {
						lineActive: isActive && i <= index,
						line: !isActive && i > index,
					})}
				>
					<i
						className={clsx('rounded-full px-5 py-4 text-gray-300 font-medium border-none shadow-sm', {
							'bg-accent text-white': isActive && i <= index,
							'bg-white text-accent': !isActive && i > index,
						})}
					>
						{list}
					</i>
				</li>
			))}
		</ol>
	);
};

export default Stepper
