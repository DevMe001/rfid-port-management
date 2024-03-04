import Ship from '../../assets/home/ship01.jpg';
import Footer from '../../assets/home/footer.png';
import Logo from '../../assets/home/logo.png';
import { onToggleNav } from '../../utils/hooks/globa.state';
import { useCallback } from 'react';
import RenderIf from '../../common/components/ui/render-if';
import CatalogDisplay from '../../common/widget/slider';

const HomePage = () => {

	const [toggle, setToggle] = onToggleNav();




	const onNavigationMobileShow = useCallback(() => {
		setToggle(!toggle);
	}, [toggle]);


	
  return (
		<div className='relative grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh repeat(2,1fr) 10vh' }}>
			<RenderIf value={!toggle}>
				<div className='col-start-1 -col-end-1 row-start-1 row-end-1 bg-secondary z-10'>
					<header className='flex flex-1 gap-2 justify-between items-center'>
						<div className='flex justify-center items-center md:pl-5'>
							<img src={Logo} alt='' className='w-[3rem] h-[3rem] sm:w-[5rem] sm:h-[5rem] object-fit' />
							<span className='text-lite font-bold text-xl'>Port system</span>
						</div>

						{/* desktop view navigation */}
						<nav className='hidden md:block'>
							<ul className='flex justify-between items-baseline gap-4 px-10 text-lite font-medium text-xl cursor-pointer'>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>HOME</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>BOOK</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>SCHEDULE</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>ABOUT US</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>CONTACT US</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>LOGIN</li>
							</ul>
						</nav>

						{/* for mobile view navigation */}
						<RenderIf value={!toggle}>
							<nav className='flex md:hidden'>
								<ul>
									<li onClick={onNavigationMobileShow} className='hover:bg-navy hover:text-navy'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-12 h-12 text-lite'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5' />
										</svg>
									</li>
								</ul>
							</nav>
						</RenderIf>
					</header>
				</div>
			</RenderIf>
			{/* collabsible navigation */}

			<RenderIf value={toggle}>
				<div
					className={`absolute left-0 right-0 bottom-0 w-screen h-screen bg-primary overflow-hidden md:hidden`}
					style={{
						top: toggle ? '0' : '100%',
						transition: 'all 5 ease',
					}}
				>
					<div className='w-full flex justify-between pr-4'>
						<img src={Logo} alt='' className='w-[8rem] h-[8rem] object-fit' />

						<p onClick={onNavigationMobileShow} className='mt-4 text-5xl text-lite font-semibold'>
							&times;
						</p>
						{/* You can add additional elements here for the right side of the header */}
					</div>
					<nav className=''>
						<ul className='flex flex-col justify-center items-center gap-7 h-full text-lite font-medium'>
							<li>Home</li>
							<li>Book</li>
							<li>SCHEDULE</li>
							<li>ABOUT US</li>
							<li>CONTACT US</li>
							<li>LOGIN</li>
						</ul>
					</nav>
				</div>
			</RenderIf>

			<RenderIf value={!toggle}>
				<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[100%] sm:h-[60vh]  md:h-[70vh] lg:h-[70vh]'>
					<CatalogDisplay />
					<article>
						<p className='text-navy font-semibold text-center xs:text-xl md:text-4xl my-4 lg:my-10'>Welcome to Port Roxas</p>
					</article>
					<section className='flex flex-col gap-5  w-full mx-auto md:flex-row sm:justify-evenly  sm:items-center lg:my-8 md:gap-0 px-5'>
						<img src={Ship} alt='' className='h-[20rem]  md:h-[25rem] lg:w-[40rem] mx-auto' />

						<article className='max-w-[50ch] text-center leading-7 md:text-left font-medium xs:text-xl md:3xl text-navy'>The Port of Roxas, Oriental Mindoro (Filipino: Pantalan ng Rozas,Oriental Mindoro) or Dangay Port is the seapot in Roxas,Oriental Mindoro in the philippines. The seaport serves as gateway to Mindanao and Visayas from Luzon with passengers being transported from Dangay to Caticlan.</article>
					</section>
				</main>
			</RenderIf>

			{/* sm && md && lg */}

			<RenderIf value={!toggle}>
				<div className='hidden sm:flex col-start-1 -col-end-1 row-start-4 row-end-5 h-screen sm:h-[40vh] md:h-[60vh] lg:h-[40vh] overflow-y-auto'>
					<footer className='text-center md:text-left w-full flex flex-col md:flex-row  justify-around items-baseline flex-wrap  h-full py-6' style={{ background: `url(${Footer}) no-repeat`, backgroundSize: 'cover', width: '100%' }}>
						<section className='flex flex-col gap-12'>
							<div className='title'>
								<h2 className='text-lite text-3xl font-bold'>Port of Roxas,Inc</h2>
								<h4 className='text-lite text-xl'>Address: HGVJ+75X,Roxas, Oriental Mindoro</h4>
								<h4 className='text-lite text-xl'>Hours: Open 24hours</h4>
							</div>
							<div className='flex flex-col gap-4 md:gap-0 md:flex-row justify-between text-lite'>
								<i data-title='facebook'>
									<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' fill='none' viewBox='0 0 34 34'>
										<path fill='#fff' d='M19.577 33.5V21.9h3.845l.731-4.8h-4.576v-3.114c0-1.312.638-2.593 2.69-2.593h2.081V7.307s-1.889-.324-3.694-.324c-3.768 0-6.232 2.297-6.232 6.46V17.1h-4.19v4.8h4.19V33.5C6.534 32.255.5 25.387.5 17.1.5 7.933 7.887.5 17 .5s16.5 7.432 16.5 16.6c0 8.287-6.034 15.155-13.923 16.4z'></path>
									</svg>
								</i>
								<i data-title='twitter'>
									<svg xmlns='http://www.w3.org/2000/svg' width='37' height='36' fill='none' viewBox='0 0 37 36'>
										<path fill='#fff' d='M32.816 11.05a.625.625 0 00-.25-1.087l-.987-.25a.625.625 0 01-.413-.875l.55-1.113a.625.625 0 00-.725-.875l-2.5.7a.625.625 0 01-.55-.1 6.25 6.25 0 00-10 5v.45a.313.313 0 01-.275.313c-3.512.412-6.875-1.375-10.5-5.55a.638.638 0 00-.637-.188.625.625 0 00-.363.525 9.475 9.475 0 00.575 6.15.312.312 0 01-.325.45l-1.4-.275a.625.625 0 00-.712.738 6.438 6.438 0 002.962 4.725.312.312 0 010 .562l-.662.263a.625.625 0 00-.325.862 5.45 5.45 0 004 3.1.313.313 0 010 .588A13.675 13.675 0 014.916 26.2a.637.637 0 10-.25 1.25 25.076 25.076 0 0010.175 2.413c3.1.047 6.144-.823 8.75-2.5a15.626 15.626 0 006.95-13.038v-1.087a.625.625 0 01.225-.475l2.05-1.713z'></path>
									</svg>
								</i>
								<i data-title='youtube'>
									<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' stroke='currentColor' fill='none' viewBox='0 0 36 36'>
										<path fill='#fff' d='M32.701 12s-.293-2.068-1.195-2.977c-1.143-1.195-2.42-1.2-3.006-1.271-4.195-.305-10.494-.305-10.494-.305h-.012s-6.299 0-10.494.305c-.586.07-1.863.076-3.006 1.271C3.592 9.932 3.304 12 3.304 12S3 14.432 3 16.857v2.274c0 2.426.299 4.857.299 4.857s.293 2.069 1.19 2.977c1.142 1.195 2.642 1.154 3.31 1.283 2.402.229 10.201.299 10.201.299s6.305-.012 10.5-.31c.586-.071 1.863-.077 3.006-1.272.902-.908 1.195-2.977 1.195-2.977S33 21.563 33 19.131v-2.274c0-2.425-.299-4.857-.299-4.857zm-17.8 9.89V13.46l8.103 4.23-8.104 4.202z'></path>
									</svg>
								</i>
								<i data-title='linkin'>
									<svg xmlns='http://www.w3.org/2000/svg' width='37' height='36' fill='none' viewBox='0 0 37 36'>
										<path fill='#fff' d='M12.24 29.033H7.443V13.175h5.007v15.858h-.208zM9.947 11.088c-1.67 0-2.922-1.46-2.922-2.92 0-1.67 1.252-2.922 2.922-2.922 1.669 0 2.92 1.252 2.92 2.921-.208 1.46-1.46 2.921-2.92 2.921zM30.81 29.033h-5.008v-7.72c0-1.878 0-4.174-2.504-4.174-2.503 0-2.92 2.087-2.92 4.174v7.928H15.37V13.175h4.799v2.086c.626-1.251 2.295-2.503 4.59-2.503 5.008 0 5.842 3.338 5.842 7.511v8.764h.21z'></path>
									</svg>
								</i>
							</div>
						</section>
						<section className='text-lite'>
							<h3 className='text-lite text-2xl font-bold'>Usefull Links</h3>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> <span>Home</span>
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Carrier
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Travel
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> RFID card/tags
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Term of services
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Private Policy
							</p>
						</section>

						<section className='text-lite'>
							<h3 className='text-lite text-2xl font-bold'>Our Services</h3>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Blogs
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> News
							</p>
							<p>
								<span className='font-bold text-4xl text-accent mr-2'>{'>'}</span> Vessels
							</p>
						</section>
					</footer>
				</div>
			</RenderIf>

			{/* xss xs */}
			<RenderIf value={!toggle}>
				<div className='block sm:hidden md:hidden lg:hidden col-start-1 -col-end-1 row-start-4 row-end-5 h-screen my-10'>
					<footer className='p-6' style={{ background: `url(${Footer}) no-repeat`, backgroundSize: 'cover', width: '100%' }}>
						<section className='flex flex-col justify-center items-center gap-12'>
							<div className='flex flex-col justify-center items-center text-center'>
								<h2 className='text-lite text-3xl font-bold'>Port of Roxas,Inc</h2>
								<h4 className='text-lite text-xl'>Address: HGVJ+75X,Roxas, Oriental Mindoro</h4>
								<h4 className='text-lite text-xl'>Hours: Open 24hours</h4>
							</div>
							<div className='flex gap-5 md:gap-0 md:flex-row justify-between text-lite my-10'>
								<i data-title='facebook'>
									<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' fill='none' viewBox='0 0 34 34'>
										<path fill='#fff' d='M19.577 33.5V21.9h3.845l.731-4.8h-4.576v-3.114c0-1.312.638-2.593 2.69-2.593h2.081V7.307s-1.889-.324-3.694-.324c-3.768 0-6.232 2.297-6.232 6.46V17.1h-4.19v4.8h4.19V33.5C6.534 32.255.5 25.387.5 17.1.5 7.933 7.887.5 17 .5s16.5 7.432 16.5 16.6c0 8.287-6.034 15.155-13.923 16.4z'></path>
									</svg>
								</i>
								<i data-title='twitter'>
									<svg xmlns='http://www.w3.org/2000/svg' width='37' height='36' fill='none' viewBox='0 0 37 36'>
										<path fill='#fff' d='M32.816 11.05a.625.625 0 00-.25-1.087l-.987-.25a.625.625 0 01-.413-.875l.55-1.113a.625.625 0 00-.725-.875l-2.5.7a.625.625 0 01-.55-.1 6.25 6.25 0 00-10 5v.45a.313.313 0 01-.275.313c-3.512.412-6.875-1.375-10.5-5.55a.638.638 0 00-.637-.188.625.625 0 00-.363.525 9.475 9.475 0 00.575 6.15.312.312 0 01-.325.45l-1.4-.275a.625.625 0 00-.712.738 6.438 6.438 0 002.962 4.725.312.312 0 010 .562l-.662.263a.625.625 0 00-.325.862 5.45 5.45 0 004 3.1.313.313 0 010 .588A13.675 13.675 0 014.916 26.2a.637.637 0 10-.25 1.25 25.076 25.076 0 0010.175 2.413c3.1.047 6.144-.823 8.75-2.5a15.626 15.626 0 006.95-13.038v-1.087a.625.625 0 01.225-.475l2.05-1.713z'></path>
									</svg>
								</i>
								<i data-title='youtube'>
									<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' fill='none' viewBox='0 0 36 36'>
										<path fill='#fff' d='M32.701 12s-.293-2.068-1.195-2.977c-1.143-1.195-2.42-1.2-3.006-1.271-4.195-.305-10.494-.305-10.494-.305h-.012s-6.299 0-10.494.305c-.586.07-1.863.076-3.006 1.271C3.592 9.932 3.304 12 3.304 12S3 14.432 3 16.857v2.274c0 2.426.299 4.857.299 4.857s.293 2.069 1.19 2.977c1.142 1.195 2.642 1.154 3.31 1.283 2.402.229 10.201.299 10.201.299s6.305-.012 10.5-.31c.586-.071 1.863-.077 3.006-1.272.902-.908 1.195-2.977 1.195-2.977S33 21.563 33 19.131v-2.274c0-2.425-.299-4.857-.299-4.857zm-17.8 9.89V13.46l8.103 4.23-8.104 4.202z'></path>
									</svg>
								</i>
								<i data-title='linkin'>
									<svg xmlns='http://www.w3.org/2000/svg' width='37' height='36' fill='none' viewBox='0 0 37 36'>
										<path fill='#fff' d='M12.24 29.033H7.443V13.175h5.007v15.858h-.208zM9.947 11.088c-1.67 0-2.922-1.46-2.922-2.92 0-1.67 1.252-2.922 2.922-2.922 1.669 0 2.92 1.252 2.92 2.921-.208 1.46-1.46 2.921-2.92 2.921zM30.81 29.033h-5.008v-7.72c0-1.878 0-4.174-2.504-4.174-2.503 0-2.92 2.087-2.92 4.174v7.928H15.37V13.175h4.799v2.086c.626-1.251 2.295-2.503 4.59-2.503 5.008 0 5.842 3.338 5.842 7.511v8.764h.21z'></path>
									</svg>
								</i>
							</div>
						</section>
						<h3 className='text-lite text-2xl font-bold text-center my-5'>Usefull Links</h3>
						<section className='w-[80%] flex flex-row justify-between items-between  text-lite mx-auto'>
							<section className='w-6/12'>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> <span>Home</span>
								</p>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> Carrier
								</p>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> Travel
								</p>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> RFID card/tags
								</p>
							</section>
							<section className='w-6/12'>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> Term of services
								</p>
								<p>
									<span className='font-bold text-2xl text-accent'>{'>'}</span> Private Policy
								</p>
							</section>
						</section>
						<h3 className='text-lite text-2xl font-bold text-center my-5'>Our Services</h3>

						<section className='w-[90%] flex flex-col justify-between items-center  text-lite'>
							<p>
								<span className='font-bold text-2xl text-accent'>{'> '}</span> Blogs
							</p>
							<p>
								<span className='font-bold text-2xl text-accent'>{'> '}</span> News
							</p>
							<p>
								<span className='font-bold text-2xl text-accent'>{'> '}</span> Vessels
							</p>
						</section>
					</footer>
				</div>
			</RenderIf>

			{/* end input */}
		</div>
	);
};

export default HomePage;
