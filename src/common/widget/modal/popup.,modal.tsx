import React, { useCallback, useRef } from 'react'
import { onToggleBookingModal } from '../../../utils/hooks/globa.state';
import clsx from 'clsx';


type ModalProps ={
	children:React.ReactNode,
}

const PopupModal:React.FC<ModalProps> = ({children}) => {
	  const [modal, setModal] = onToggleBookingModal();

	  const bodyRef = useRef<HTMLBodyElement>(null);
		const modalRef = useRef<HTMLDivElement>(null);

	const onOpen = useCallback(() => {
		setModal(!modal);
		document.body.style.overflow = 'hidden';
		 if (!modal) {
				document.body.style.overflow = 'hidden';
				if (bodyRef.current) {
					bodyRef.current.style.overflow = 'hidden';
				}
			} else {
				document.body.style.overflow = '';
				if (bodyRef.current) {
					bodyRef.current.style.overflow = '';
					
				}

			}
	}, [modal]);

		const handleContentClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			event.stopPropagation(); // Stop event propagation to prevent modal closure
		};


	return (
		<div onClick={onOpen} className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] z-10 w-screen h-screen max-w-[90rem]' ref={modalRef}>
			<div className='flex flex-col justify-center items-center h-full'>
				{/*  iwant this not hied when someone clicn in this part of box */}
				<div
					onClick={handleContentClick}
					className={clsx('bg-white w-auto h-2/2 rounded-md animate-fade relative')}
				>
					<p className='flex w-auto justify-end items-center font-bold text-navy pr-5 pt-5 text-3xl'>
						<span onClick={onOpen}>&times;</span>
					</p>

					<div className='p-4'>{children}</div>
				</div>
			</div>
		</div>
	);
}

export default PopupModal
