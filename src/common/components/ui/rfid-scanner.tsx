import clsx from 'clsx';
import { isEmpty } from 'lodash';
import React from 'react'
import RFID from '../../../assets/dashboard/rfid_scanner.svg'
import './styles/rfid.css'
import RenderIf from './render-if';
import { TextInput } from 'flowbite-react';
import CustomButton from './button.componetnt';

type ScannerProps = {
	scan: string;
	handleEnableFocus: () => void;
	scanning: boolean;
	inputRef: React.RefObject<HTMLInputElement>;
	handleScannerDevice: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCodeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: () => void;
};


const RFIDScannerDevice: React.FC<ScannerProps> = ({ scan, handleEnableFocus, scanning, inputRef, handleScannerDevice, onCodeInput, onSubmit }) => {
	return (
		<div className='p-2' onMouseEnter={handleEnableFocus}>
			<p className='p-2 my-2 text-center font-medium'>{!isEmpty(scan) && !scanning ? 'Your RFID Number:' : !isEmpty(scan) && scanning ? 'Checking....' : 'Scan now'}</p>
			<p className='text-navy text-center text-xl my-2 break-words'>{scan}</p>

			<RenderIf value={!isEmpty(scan)}>
				<div className='flex flex-col justify-center items-center'>
					<TextInput name='code' onChange={onCodeInput} className='my-5' placeholder='Enter pin code' />
					<CustomButton label={'Submit'} onClick={onSubmit} className='my-5' />
				</div>
			</RenderIf>
			<RenderIf value={isEmpty(scan)}>
				<label htmlFor='rfidscanner'>
					<div className='flex  justify-center items-center'>
						<div
							className={clsx({
								'rfid-scanner': scanning,
							})}
						>
							<img src={RFID} alt='rfid' />
						</div>
					</div>
				</label>
				<input id='rfidscanner' ref={inputRef} value={scan} type='text' className='visually-hidden' onChange={handleScannerDevice} autoFocus={true} />
			</RenderIf>
		</div>
	);
};

export default RFIDScannerDevice
