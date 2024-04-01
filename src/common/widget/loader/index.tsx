import React, { useEffect } from 'react';
import RenderIf from '../../components/ui/render-if';


type LoaderProps={
  load:boolean;
}

const LoaderSpinner: React.FC<LoaderProps> = ({ load }) => {
	useEffect(() => {
		if (load === true) {
			// Scroll to the top of the page
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});

			document.body.style.overflow = 'hidden';

			
		}
    else{
			document.body.style.overflow = '';

    }
	}, [load]);

	return (
		<RenderIf value={load}>
			<div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] z-10 w-screen h-screen max-w-[90rem]'>
				<div className='flex flex-col justify-center items-center h-full'>
					{/*  iwant this not hied when someone clicn in this part of box */}
					<div className='loader-effect'></div>
				</div>
			</div>
		</RenderIf>
	);
};

export default LoaderSpinner;
