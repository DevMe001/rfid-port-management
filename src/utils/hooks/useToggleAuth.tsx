import React, { useCallback, useRef } from 'react'
import { onToggleModal } from './globa.state';

const useToggleAuth = () => {

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
  return { modal, setModal, onOpen, modalRef };
}

export default useToggleAuth
