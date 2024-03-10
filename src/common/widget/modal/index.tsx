import React, { useCallback, useRef } from 'react';
import { onToggleModal } from '../../../utils/hooks/globa.state';
import RenderIf from '../../components/ui/render-if';
import clsx from 'clsx';


type ModalProps={
  label:string;
	children?:React.ReactNode
}

const Modal:React.FC<ModalProps> = ({label,children}) => {

  const [modal, setModal] = onToggleModal();

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
		<>
			<span className='uppercase' onClick={onOpen}>
				{label}
			</span>
			<RenderIf value={modal}>
				<div onClick={onOpen} className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] z-10 w-screen h-screen max-w-[90rem]' ref={modalRef}>
					<div className='flex flex-col justify-center items-center h-full'>
						{/*  iwant this not hied when someone clicn in this part of box */}
						<div
							onClick={handleContentClick}
							className={clsx('bg-lite w-auto h-1/2 rounded-md animate-fade', {
								'animate-fadeOut': !modal, // Conditionally apply the animate-fadeOut class
							})}
						>
							<p className='flex w-auto justify-end items-center font-bold text-navy pr-5 pt-5 text-3xl'>
								<span onClick={onOpen}>&times;</span>
							</p>

							<div className='flex flex-col justify-center items-center h-[90%] flex-wrap flex-1 p-10'>{children}</div>
						</div>
					</div>
				</div>
			</RenderIf>
		</>
	);
}

export default Modal
