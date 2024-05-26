import clsx from 'clsx';
import { isEmpty } from 'lodash';
import React from 'react';
import RFID from '../../../assets/dashboard/rfid_scanner.svg';
import './styles/rfid.css';
import RenderIf from './render-if';
import { TextInput } from 'flowbite-react';
import CustomButton from './button.componetnt';

type WalletProps = {
	onAccountNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCodeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: () => void;
};

const WalletCredential: React.FC<WalletProps> = ({ onAccountNumber,onCodeInput, onSubmit }) => {
	return (
		<div className='p-2'>
			<div className='flex flex-col justify-center items-center'>
				<TextInput name='account' onChange={onAccountNumber} className='my-5' placeholder='Account Number' required />
				<TextInput name='code' onChange={onCodeInput} className='my-5' placeholder='Enter pin code' required />
				<CustomButton label={'Submit'} onClick={onSubmit} className='my-5' />
			</div>
		</div>
	);
};

export default WalletCredential;
