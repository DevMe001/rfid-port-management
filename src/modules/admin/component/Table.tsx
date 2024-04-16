import { Table } from 'flowbite-react';
import { isEmpty, startCase } from 'lodash';
import React from 'react';

type TableProps = {
	header: string[];
	body: (string | JSX.Element)[][];
};

const TableList: React.FC<TableProps> = ({ header, body }) => {
	return (
		<Table striped hoverable>
			<Table.Head>{!isEmpty(header) && header.map((head, index) => <Table.HeadCell key={index}>{startCase(head)}</Table.HeadCell>)}</Table.Head>
			<Table.Body className='divide-y'>
				{!isEmpty(body) ? (
					body.map((row, rowIndex) => (
						<Table.Row key={rowIndex} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
							{row.map((cellContent, cellIndex) => (
								<Table.Cell key={cellIndex} className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
									{typeof cellContent === 'string' ? (
										cellContent // If cellContent is already a string, render it as is
									) : (
										<>{cellContent}</> // If cellContent is JSX.Element, render it
									)}
								</Table.Cell>
							))}
						</Table.Row>
					))
				) : (
					<Table.Row>
						<Table.Cell className='text-center' colSpan={header.length}>
							<p className='text-warning font-medium text-sm'> No data available</p>
						</Table.Cell>
					</Table.Row>
				)}
			</Table.Body>
		</Table>
	);
};

const TableRender = React.memo(TableList);

export default TableRender;
