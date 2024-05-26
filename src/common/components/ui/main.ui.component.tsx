import { isEmpty, isUndefined } from "lodash"
import { FaFacebookMessenger } from 'react-icons/fa6';
import { RootState, useAppDispatch, useAppSelector } from "../../../utils/redux/store";
import React, { useCallback, useState } from "react";
import RenderIf from "./render-if";
import useNavigationHandler from "../../../utils/hooks/useNavigationHandler";

import { useGetReceiveMessageQuery, useGetUnreadCountQuery, useUpdateMessageStatusMutation } from "../../../api-query/chat-api";
import { useGetProfileAccountQuery } from "../../../api-query/account-api";
import clsx from "clsx";
import { enqueueSnackbar } from "notistack";
import { useChatToggle } from "../../../utils/hooks/globa.state";
import { storeUserMessage } from "../../../utils/redux/slicer/chatUserDisplay";
import { dateFormatted } from "../../../utils";

import { storeChat } from "../../../utils/redux/slicer/chatSlice";
import { TransctionCount, useGetTransactionCountAllQuery } from "../../../api-query/transaction.api.services";
import { LineChart } from "../../widget/chart/line";
import { PieChart } from "../../widget/chart/pie";




export const MessageNotificationUserBox: React.FC = () => {
	const [notificationToggle, setNotificationToggle] = useState<boolean>(false);


	const [, setToggle] = useChatToggle();

    const user = useAppSelector((state: RootState) => state.authUser);


	const { data: accountUser } = useGetProfileAccountQuery(user?.id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });	
	
	const { data: unreadCount } = useGetUnreadCountQuery(accountUser?.account_id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });


	
	const { data: getMessageNotifiacation } = useGetReceiveMessageQuery(accountUser?.account_id as string, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });



	const [updateMessageStatus] = useUpdateMessageStatusMutation();






const dispatch = useAppDispatch();

const onUserMessageBubble = useCallback(async (sender_id:string) => {


	const statusUnread = {
		sender_id: sender_id,
		receive_id: accountUser?.account_id as string
	};

	try {
	const res =  await updateMessageStatus(statusUnread);

		if(res){
			setToggle(true);

			

			dispatch(storeUserMessage([]));
			if('data' in res){
				dispatch(storeUserMessage(res.data));
				setNotificationToggle(false);
				dispatch(storeChat({ connectAdmin: true, sender_id: sender_id }));
			}


		}


	} catch (error) {
		enqueueSnackbar('Something erro on server side', { variant: 'error', autoHideDuration: 2000 });
	}
}, []);




	return (
		<div>
			<div className='relative'>
				<FaFacebookMessenger
					size={30}
					onClick={() => setNotificationToggle(!notificationToggle)}
					className={clsx('cursor-pointer', {
						'text-gray-200': isEmpty(getMessageNotifiacation?.data) || unreadCount === 0,
						'text-primary': !isEmpty(getMessageNotifiacation?.data) && unreadCount !== 0,
					})}
				/>
				<RenderIf value={!isEmpty(getMessageNotifiacation?.data) && unreadCount !== 0}>
					<sup className='absolute right-0 left-8 text-lg font-medium text-white w-[1.5rem] h-[1.4rem] rounded-full bg-accent'>
						<span className='flex justify-center items-center -mt-1'>{unreadCount}</span>
					</sup>
				</RenderIf>
			</div>
			<RenderIf value={notificationToggle}>
				<div className='absolute top-20 right-10 bg-white w-[18rem] h-[auto] min-h-[20rem] max-h-[20rem] z-[9999] shadow-md p-5 overflow-y-auto'>
					<RenderIf value={!isEmpty(getMessageNotifiacation?.data)}>
						<p className='font-medium text-center mb-5'>Message</p>
					</RenderIf>

					<ul className='text-lg text-center '>
						<li className='text-navy font-medium'>
							<RenderIf value={!isEmpty(getMessageNotifiacation?.data)}>
								<ul>
									{!isEmpty(getMessageNotifiacation) &&
										getMessageNotifiacation?.data.map((notif, i) => (
											<li key={i} className='border-b border-gray-200 my-2' onClick={() => onUserMessageBubble(notif.sender_id)}>
												<span className='flex gap-2 cursor-pointer'>
													<div className='cursor-pointer uppercase bg-accent text-white rounded-full py-1 px-3 w-[2rem] h-[2rem] flex justify-center items-center shadow-md font-medium text-lg'>{notif.senderDisplayName.slice(0, 1)}</div>
													<div className='flex flex-col justify-center items-center w-full'>
														<p
															className={clsx({
																'text-gray-800 font-medium': notif.status == 'unread',
																'font-light text-gray-300 ': notif.status == 'read',
															})}
														>
															{notif.senderDisplayName}
														</p>
														<p
															className={clsx({
																'text-gray-800 font-bold': notif.status == 'unread',
																'font-light text-gray-300 ': notif.status == 'read',
															})}
														>
															{notif.message}
														</p>
													</div>
													<sup
														className={clsx('text-sm', {
															'text-gray-500': notif.status == 'unread',
															'font-light text-gray-300 ': notif.status == 'read',
														})}
													>
														{dateFormatted(notif.createdAt)}
													</sup>
												</span>
											</li>
										))}
								</ul>
							</RenderIf>
							<RenderIf value={isEmpty(getMessageNotifiacation?.data) || isUndefined(getMessageNotifiacation)}>
								<ul className='text-red-500'>No notification found</ul>
							</RenderIf>
						</li>
					</ul>
				</div>
			</RenderIf>
		</div>
	);
}; 


export const DashboardHeader:React.FC = ()=>{

    const user = useAppSelector((state: RootState) => state.authUser);
		const [userProfile, setProfile] = useState<boolean>(false);
		const [onHandlerNavigationEvent] = useNavigationHandler();




    return (
			<>
				<div className=' flex justify-end bg-white p-4 shadow-sm items-center gap-10'>
					<MessageNotificationUserBox />
					<div onClick={() => setProfile(!userProfile)} className='cursor-pointer uppercase bg-accent text-white rounded-full py-1 px-3 w-[3rem] h-[3rem] flex justify-center items-center shadow-md font-medium text-lg'>
						{user.displayName.slice(0, 1)}
					</div>
				</div>
				<RenderIf value={userProfile}>
					<div className='absolute top-20 right-0 bg-white w-[10rem] h-[3rem] z-10 shadow-md' onMouseOut={() => setProfile(!userProfile)}>
						<ul className='text-lg text-center '>
							<li className='text-navy font-medium' onClick={() => onHandlerNavigationEvent('signout')}>
								Logout
							</li>
						</ul>
					</div>
				</RenderIf>
			</>
		);
} 


const DashboardMain:React.FC = () => {

		const { data: dashboardCount } = useGetTransactionCountAllQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

		console.log(dashboardCount, 'get count');

	const getCountList: TransctionCount = dashboardCount as unknown as TransctionCount ?? 0;

		const cardBox = [
			{
				count: getCountList?.wallet,
				label: 'Wallet fund',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.payment,
				label: 'Total Sales',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.booking,
				label: 'Booking',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.schedule,
				label: 'Schedule',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.rfid,
				label: 'RFID Slot',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.vehicle,
				label: 'Vehicles',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.user,
				label: 'Users',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
				</svg>
				`,
				cb: null,
			},
			{
				count: getCountList?.passengers,
				label: 'Passengers',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
				</svg>
				`,
				cb: null,
			},
		];



  return (
		<div className='relative main !bg-lite'>
			<DashboardHeader />
			<div className='cardBox bg-lite'>
				{!isEmpty(cardBox) &&
					cardBox.map((card, i) => (
						<div key={i} className='card'>
							<div>
								<div className='numbers'>{card.count}</div>
								<div className='cardName'>{card.label}</div>
							</div>

							<div className='iconBx'>
								<span className='icon' dangerouslySetInnerHTML={{ __html: card.icon }}></span>
							</div>
						</div>
					))}
			</div>
			<div className='flex justify-evenly h-full'>
				<div className='w-7/12 bg-white m-5 rounded p-5 h-[50%]'>
					<LineChart />
				</div>
				<div className='w-5/12 rounded'>
					<PieChart />
				</div>
			</div>
		</div>
	);
}

export default DashboardMain