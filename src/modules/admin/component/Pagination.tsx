import React from "react";

type Pagination = {
	prev: () => void;
	currentPage: number;
	totalPage: number;
	next: () => void;
};

const Paginate: React.FC<Pagination> = ({ prev, currentPage, totalPage, next }) => {
	return (
		<div className='w-full'>
			<div className='flex justify-end pr-5 mt-5  shadow-sm'>
				<div className='bg-white w-auto py-1 px-2 flex justify-between gap-3'>
					<span className='font-medium cursor-pointer text-navy' onClick={prev}>
						Prev
					</span>
					<span>|</span>
					<span className='text-navy'>
						<p className='text-center'>
							Page {currentPage} / Page {totalPage}
						</p>
					</span>
					<span>|</span>
					<span className='font-medium cursor-pointer text-navy' onClick={next}>
						Next
					</span>
				</div>
			</div>
		</div>
	);
};

const PaginationRender = React.memo(Paginate);

export default PaginationRender