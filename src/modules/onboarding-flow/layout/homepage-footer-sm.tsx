import BgFooter from '../../../assets/home/footer.png';



const FooterXS = () => {

  return (
				<div className='block sm:hidden md:hidden lg:hidden col-start-1 -col-end-1 row-start-4 row-end-5 h-screen my-10'>
					<footer className='p-6' style={{ background: `url(${BgFooter}) no-repeat`, backgroundSize: 'cover', width: '100%' }}>
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

	);
}

export default FooterXS;
