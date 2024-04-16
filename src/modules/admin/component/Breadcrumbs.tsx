import React from 'react'
import { MdOutlineArrowForwardIos } from 'react-icons/md';


type BreadcrumbsProps={
  group:string;
  activeLink:string;
}


const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ group, activeLink }) => {
	return (
		<div className=' flex gap-2 items-center pl-5 pt-5'>
			<span className='text-active font-medium'>{group}</span>
			<span>
				<MdOutlineArrowForwardIos />
			</span>
			<span className=' text-accent font-semibold'>{activeLink}</span>
		</div>
	);
};

export default Breadcrumbs
