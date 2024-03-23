import React from 'react';
import './styles/stepper.css'
import clsx from 'clsx';


const stepperList:string[]=[
  'Passenger',
  'Form',
  'Billing'
]




const Stepper:React.FC<{isActive:boolean}> = ({isActive}) => {
  return (
		<ol className='flex gap-2 w-full justify-evenly items-baseline mt-12'>
			{stepperList.map((list, i) => (
				<li
					key={i}
					className={clsx('mr-8', {
						line: i < 2,
					})}
				>
					<i className={clsx('rounded-full bg-teal-200 px-5 py-4 text-white font-medium',{
						'bg-accent':isActive
					})}>{list}</i>
				</li>
			))}
		</ol>
	);
}

export default Stepper
