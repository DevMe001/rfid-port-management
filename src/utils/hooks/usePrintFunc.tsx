import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';

const usePrintFunc = () => {

 const componentRef = useRef<HTMLDivElement>(null);

  const exportRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

   const handlePrint = () => {
			if (componentRef.current) {
				const printableContent = componentRef.current.innerHTML;
				const originalContent = document.body.innerHTML;

				// Replace the body content with the printable content
				document.body.innerHTML = printableContent;

				// Trigger the print dialog
				window.print();

				// Restore the original content after printing (or cancel)
				document.body.innerHTML = originalContent;

				// Set printActive state to false after printing
			}

			if (window.matchMedia) {
				const mediaQueryList = window.matchMedia('cancel');
				if (mediaQueryList.media === 'cancel') {
					navigate(0);
				}
			}
		};



  return { componentRef,exportRef, handlePrint };
}

export default usePrintFunc
