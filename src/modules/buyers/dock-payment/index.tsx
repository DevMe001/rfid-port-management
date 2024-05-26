import React, { useCallback, useEffect, useRef, useState } from 'react'

import PaymentDesign from '../../../assets/pay/dock-payment.svg';
import RFIDScanner from '../../../assets/pay/rfid_device.svg';
import waitSec from '../../../utils/setTimeout';
import { usePostTransactionMutation } from '../../../api-query/transaction.api.services';
import clsx from 'clsx';
import { isEmpty, startCase } from 'lodash';
import { enqueueSnackbar } from 'notistack';

const DockPay = () => {

	const [scan, setScan] = useState<string>('');
	const [scanning, setScanning] = useState<boolean>(false);
	const [rfidAccount, setRFIDACCOUnt] = useState<string>('');

	const inputRef = useRef<HTMLInputElement>(null);

	const [postTransaction] = usePostTransactionMutation();


  let counter = 1;

	let valueArr: string[] = [];
  const handleScannerDevice = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setScanning(true);

			valueArr.push(value);

			await waitSec(2000);
			setScanning(false);

			if (isEmpty(rfidAccount)) {
				if (counter === 1) {
					onResponse();
					counter = 0;
				}
			}
		},
		[rfidAccount], // Include setValueArr in the dependency array
	);

const focusInput = () => {
	if (inputRef.current) {
		inputRef.current.focus();
	} else {
		console.error('Element with id "scanner" not found.');
	}
};

 

  const onResponse = useCallback(async () => {

		setRFIDACCOUnt(valueArr.join(''));

		const data = { account_number: valueArr.join('') };

	
		const res: any = await postTransaction(data);

		console.log(res.data.message);
		if (res.data.message.includes('Transaction completed')) {
			enqueueSnackbar(startCase(res.data.message as string), { variant: 'success', autoHideDuration: 3000 });
		} else {
			enqueueSnackbar(startCase(res.data.message as string), { variant: 'warning', autoHideDuration: 3000 });
		}
		setScan('');
		valueArr = [];
		setRFIDACCOUnt('');
	
	}, [rfidAccount]);



  return (
		<div className='w-screen h-screen overflow-hidden m-0 p-0 relative' onMouseEnter={focusInput} onMouseMove={focusInput} onClick={focusInput}>
			<img src={PaymentDesign} alt='error-page' onMouseEnter={focusInput} onClick={focusInput} onMouseMove={focusInput} />

			<div className='absolute bottom-10 right-10 rfid '>
				<div
					className={clsx('relative', {
						'rfid-scanner': scanning,
					})}
				>
					<img src={RFIDScanner} alt='error-page' />
					<input id='scanner' ref={inputRef} value={scan} type='text' className='visually-hidden absolute bottom-10 right-10 ' onChange={handleScannerDevice} autoFocus={true} />
				</div>
			</div>
			<style>
				{`
        .rfid-scanner {
        position: relative;
       
      }

      .rfid-scanner::after {
        position: absolute;
        content: "";
        width: 0.3rem;
        height: 0.7rem;
      
        bottom: 1.7rem;
        right: 0.7rem;
        z-index: 1;
        animation: light 1.5s ease-in-out alternate infinite;
      }


        @keyframes light {
          from {
          background: transparent;
          }
          to {
            background: #cdff18;
          }
        }

        .visually-hidden {
          width:10rem;
          opacity: 0;
        }
      `}
			</style>
		</div>
	);
}

export default DockPay;
