import React, { useEffect } from 'react';
import { catalogsList } from './data';

type ThumbProps = {
	items: Array<{ thumb: string; image: string }>;
	currentIndex: number;
	handleClick: (index: number) => void;
};

function Thumbs({ items, currentIndex, handleClick }: ThumbProps) {
	return (
		<>
			{items.map((catalog, idx) => (
				<div key={idx} data-testid={'thumb-button-' + idx} onClick={() => handleClick(idx)}>
					<div key={idx} style={{ border: idx === currentIndex ? '1px solid #F1F0E8' : 'initial', padding: '1px', cursor: 'pointer', borderRadius: '100%' }}>
						<span>
							<img src={catalog.thumb} alt='' width={10} height={10} />
						</span>
					</div>
				</div>
			))}
		</>
	);
}

function Viewer({ catalogImage }: { catalogImage: string }) {
	return (
		<div className='shadow dark:bg-gray-900 dark:border-gray-700'>
			<img alt='catalog-view' className='w-full h-[50vh]' src={catalogImage} data-testid='catalog-view' />
		</div>
	);
}

const CatalogDisplay = () => {
	const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
	const checkRef = React.useRef<HTMLInputElement>(null);
	const catalogLength = catalogsList.length;

	useEffect(() => {
		const interval = setInterval(() => {
				if (catalogLength === selectedIndex + 1) {
					setSelectedIndex(0);
				} else {
					setSelectedIndex((prev) => prev + 1);
				}
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, [checkRef, selectedIndex, catalogLength]);

	const handlerThumbClick = (index: number) => {
		setSelectedIndex(index);
	};

	// const handlePrevCLick = () => {
	// 	setSelectedIndex((prev) => prev - 1);
	// };

	// const handleNextClick = () => {
	// 	if (catalogLength === selectedIndex + 1) {
	// 		setSelectedIndex(0);
	// 	} else {
	// 		setSelectedIndex((prev) => prev + 1);
	// 	}
	// };
	return (
		<div>
			<Viewer catalogImage={catalogsList[selectedIndex].image} />

			<div className='relative flex justify-center'>
				<div className='absolute bottom-0 flex gap-3 justify-center my-5'>
					<Thumbs items={catalogsList} currentIndex={selectedIndex} handleClick={handlerThumbClick} />
					{/* <button
								className='icon-only outlined'
								data-testid='prev-slide-btn'
								disabled={selectedIndex === 0}
								onClick={handlePrevCLick}
								style={{
									color: selectedIndex === 0 ? '#FFA500' : '#ffffff',
									cursor: selectedIndex === 0 ? 'not-allowed' : 'pointer',
								}}
							>
								<i className='material-icons'>
									<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
										<path strokeLinecap='round' strokeLinejoin='round' d='m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
									</svg>
								</i>
							</button> */}

					{/* <button
								className='icon-only outlined'
								data-testid='next-slide-btn'
								onClick={handleNextClick}
								disabled={selectedIndex === catalogLength}
								style={{
									color: selectedIndex === catalogLength ? '#FFA500' : '#ffffff',
									cursor: selectedIndex === catalogLength ? 'not-allowed' : 'pointer',
								}}
							>
								<i className='material-icons'>
									<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
										<path strokeLinecap='round' strokeLinejoin='round' d='m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
									</svg>
								</i>
							</button> */}
				</div>
			</div>
		</div>
	);
};

export default CatalogDisplay;
