import { TextInput } from 'flowbite-react';
import React from 'react'
import { FaSearch } from 'react-icons/fa';
import CustomButton from '../../../common/components/ui/button.componetnt';

type SearchProps ={
  onSearch:(e:React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit:()=>void
}



const SearchInput: React.FC<SearchProps> = ({ onSearch, onSubmit }) => {
	return (
		<div className='flex justify-end items-center pr-5 pb-2 gap-2 my-5'>
			<TextInput type='search' placeholder='Search' className='rounded !outline-none !border-none' onChange={onSearch} required />
			<CustomButton
				onClick={onSubmit}
				label={
					<p className='flex justify-center items-center gap-2'>
						Search
						<FaSearch />
					</p>
				}
			/>
		</div>
	);
};

export default SearchInput
