import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

type UsePaginationProps<T> = {
	handlePagination: (action: string) => void;
	currentPage: number;
	totalPages: number;
	paginatedData: T[];
	setData: (data: T[]) => void;
};

const usePagination = <T,>(data: T[], pageSize: number): UsePaginationProps<T> => {
	const [currentPage, setCurrentPage] = useState(1);
	const [recentData, setData] = useState<typeof data>([]);

	useEffect(() => {
		setData(data);
	}, [data]);

	const handlePagination = (action: string) => {
		if (action.toLowerCase().includes('prev') && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		} else if (action.toLowerCase().includes('next') && currentPage < getTotalPages()) {
			setCurrentPage(currentPage + 1);
		}
	};

	const getTotalPages = !isEmpty(data) ? () => Math.ceil(data.length / pageSize) : () => 0; 

	const paginatedData = !isEmpty(data) ? recentData?.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

	return { handlePagination, currentPage, totalPages: getTotalPages(), paginatedData, setData };
};
export default usePagination;
