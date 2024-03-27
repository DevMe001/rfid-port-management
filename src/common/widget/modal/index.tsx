import React, { useCallback } from 'react';
import RenderIf from '../../components/ui/render-if';
import clsx from 'clsx';
import { RootState, useAppSelector } from '../../../utils/redux/store';
import { isEmpty, isUndefined } from 'lodash';
import useToggleAuth from '../../../utils/hooks/useToggleAuth';
import useNavigationHandler from '../../../utils/hooks/useNavigationHandler';
import { useNavigate } from 'react-router-dom';
import { useGetProfileAccountQuery } from '../../../api-query/account-api';
import Immutable from '../../../immutable/constant';


type ModalProps = {
	label?: string;
	children?: React.ReactNode;
	onOpen: () => void;
};

const AuthModal: React.FC<ModalProps> = ({ label, children, onOpen }) => {
	const { modal,modalRef,boxAuth,onBoxDisplay } = useToggleAuth();
 const [onHandlerNavigationEvent] = useNavigationHandler();

	//   const [modal, setModal] = onToggleModal();

	//   const bodyRef = useRef<HTMLBodyElement>(null);
	// 	const modalRef = useRef<HTMLDivElement>(null);

	// const onOpen = useCallback(() => {
	// 	setModal(!modal);
	// 	document.body.style.overflow = 'hidden';
	// 	 if (!modal) {
	// 			document.body.style.overflow = 'hidden';
	// 			if (bodyRef.current) {
	// 				bodyRef.current.style.overflow = 'hidden';
	// 			}
	// 		} else {
	// 			document.body.style.overflow = '';
	// 			if (bodyRef.current) {
	// 				bodyRef.current.style.overflow = '';
	// 			}

	// 		}
	// }, [modal]);

	const handleContentClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation(); // Stop event propagation to prevent modal closure
	};

const navigate = useNavigate();

	
	const onRoutePath = useCallback((route: string) => {
		if (route == 'signout') {
			onHandlerNavigationEvent('signout');
		}else{
			navigate('/user-dashboard');
		}
	}, []);
  


	const users = useAppSelector((state: RootState) => state.authUser);

		

	const { data: userProfile } = useGetProfileAccountQuery(users.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

	const getProfileUser = !isEmpty(userProfile) ? userProfile : null;

	return (
		<div onMouseLeave={onBoxDisplay}>
			<RenderIf value={!isEmpty(users.displayName)}>
				<div className='relative'>
					<RenderIf value={!isEmpty(getProfileUser?.photo as unknown as string) && !isUndefined(getProfileUser)}>
						<div className='uppercase bg-white rounded-full py-1 px-3 w-[3rem] h-[3rem] flex justify-center items-center shadow-md ' onClick={onBoxDisplay}>
							<img className='object-cover' src={`${Immutable.API}/account/photo/${getProfileUser?.user_id}`} alt={getProfileUser?.photo} />
						</div>
					</RenderIf>
					<RenderIf value={isEmpty(getProfileUser?.photo as unknown as string) || isUndefined(getProfileUser)}>
						<div className='uppercase bg-accent rounded-full py-1 px-3 w-[3rem] h-[3rem] flex justify-center items-center' onClick={onBoxDisplay}>
							{users.displayName.slice(0, 1)}
						</div>
					</RenderIf>
					<RenderIf value={boxAuth}>
						<div className='absolute bg-white top-6 -left-24 right-0 bottom-0  w-[10rem] translate-x-6 translate-y-6 h-[10rem] shadow-md rounded'>
							<h5 className='text-xs text-navy my-3 text-center font-medium'>{users.email}</h5>
							<div className='flex justify-center'>
								<RenderIf value={!isEmpty(getProfileUser?.photo as unknown as string) && !isUndefined(getProfileUser)}>
									<div className='uppercase bg-white rounded-full py-1 px-3 w-[3rem] h-[3rem] flex justify-center items-center shadow-md ' onClick={() => onRoutePath('profile')}>
										<img className='object-cover' src={`${Immutable.API}/account/photo/${getProfileUser?.user_id}`} alt={getProfileUser?.photo} />
									</div>
								</RenderIf>
								<RenderIf value={isEmpty(getProfileUser?.photo as unknown as string) || isUndefined(getProfileUser)}>
									<div className='uppercase bg-accent rounded-full py-1 px-3 w-[3rem] h-[3rem] flex justify-center items-center' onClick={() => onRoutePath('profile')}>
										{users.displayName.slice(0, 1)}
									</div>
								</RenderIf>
							</div>
							<div className='flex justify-center gap-4 my-5'>
								<span className='text-accent text-sm font-medium' onClick={() => onRoutePath('profile')}>
									Profile
								</span>
								<span className='text-navy text-sm font-medium' onClick={() => onRoutePath('signout')}>
									Logout
								</span>
							</div>
						</div>
					</RenderIf>
				</div>
			</RenderIf>
			<RenderIf value={isEmpty(users.displayName)}>
				<span className='uppercase hover:text-lite hover:bg-navy hover:p-2 hover:rounded-md' onClick={onOpen}>
					{label}
				</span>
			</RenderIf>
			<RenderIf value={modal}>
				<div onClick={onOpen} className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] z-10 w-screen h-screen max-w-[90rem]' ref={modalRef}>
					<div className='flex flex-col justify-center items-center h-full'>
						{/*  iwant this not hied when someone clicn in this part of box */}
						<div
							onClick={handleContentClick}
							className={clsx('bg-lite w-auto h-2/2 rounded-md animate-fade', {
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
		</div>
	);
};

export default AuthModal;
