import  { useCallback, useRef } from 'react'
import { onToggleAuthBox, onToggleModal } from './globa.state';

const useToggleAuth = () => {

    const [modal, setModal] = onToggleModal();
		const [boxAuth, setBoxDisplay] = onToggleAuthBox();

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


		const onBoxDisplay = useCallback((e: { stopPropagation: () => void; }) => {
			setBoxDisplay(!boxAuth);
			e.stopPropagation(); 
		}, [boxAuth]);

  return { modal, setModal, onOpen,onBoxDisplay, modalRef, boxAuth };
}

export default useToggleAuth
