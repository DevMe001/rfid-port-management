import  React,{ useCallback } from 'react'
import FacebookIcon from '../../../common/components/icons/fb.icon';
import GoogleSignIn from '../../../common/components/icons/google.icon';
import RenderIf from '../../../common/components/ui/render-if';
import AuthModal from '../../../common/widget/modal';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import Logo from '../../../assets/home/logo.png';
import useToggleAuth from '../../../utils/hooks/useToggleAuth';
import { RootState, useAppSelector } from '../../../utils/redux/store';

import { isEmpty } from 'lodash';
import { MessageNotificationUserBox } from '../../../common/components/ui/main.ui.component';



const Headers: React.FC = () => {
	const [toggle, setToggle] = onToggleNavHomepageMobile();
	const { onOpen } = useToggleAuth();
	
	const user = useAppSelector((state:RootState) => state.authUser);

	const onNavigationMobileShow = useCallback(() => {
		setToggle(!toggle);
	}, [toggle]);


	const route = user.role === 1 ? '/admin-dashboard' : '/user-dashboard';
	return (
		<>
			<RenderIf value={!toggle}>
				<div className='col-start-1 -col-end-1 row-start-1 row-end-1 bg-secondary z-10'>
					<header className='flex flex-1 gap-2 justify-between items-center h-[10vh]'>
						<div className='flex justify-center items-center md:pl-5'>
							<img src={Logo} alt='' className='w-[3rem] h-[3rem] sm:w-[5rem] sm:h-[5rem] object-fit' />
							<span className='text-lite font-bold text-xl'>Port system</span>
						</div>

						{/* desktop view navigation */}
						<nav className='hidden md:block'>
							<ul className='flex justify-between items-center gap-10 px-10 text-lite font-medium text-xl cursor-pointer'>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>
									<a className='hover:text-white' href='/'>
										HOME
									</a>
								</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>
									<a className='hover:text-white' href='/booking'>
										BOOK
									</a>
								</li>
								{!isEmpty(user.accessToken) && (
									<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>
										<a className='hover:text-white' href={route}>
											DASHBOARD
										</a>
									</li>
								)}

								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>ABOUT US</li>
								<li className='hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md'>CONTACT US</li>
								{!isEmpty(user.accessToken) && (
									<li>
										<MessageNotificationUserBox />
									</li>
								)}
								<li>
									<AuthModal label='login' onOpen={onOpen}>
										<div className='flex flex-col justify-center items-center gap-1'>
											<img src={Logo} alt='' className='w-[3rem] h-[3rem] sm:w-[8rem] sm:h-[6rem] object-fit' />
											<p className='text-center font-bold uppercase text-navy'>Port system</p>

											<GoogleSignIn />
											<FacebookIcon />
										</div>
									</AuthModal>
								</li>
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
							<li>
								<AuthModal label='LOGIN' onOpen={onOpen} />
							</li>
						</ul>
					</nav>
				</div>
			</RenderIf>
		</>
	);
};

export default Headers;
