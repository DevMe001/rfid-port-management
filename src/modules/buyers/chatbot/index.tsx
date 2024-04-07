import React, { useCallback, useState, useEffect, useRef } from 'react';
import { SiChatbot } from 'react-icons/si';
import { useChatOnPoint, useChatToggle } from '../../../utils/hooks/globa.state';
import RenderIf from '../../../common/components/ui/render-if';
import clsx from 'clsx';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import moment from 'moment';
import { RootState, useAppDispatch, useAppSelector } from '../../../utils/redux/store';
import useToggleAuth from '../../../utils/hooks/useToggleAuth';
import { isEmpty, isUndefined } from 'lodash';
import { storeChat } from '../../../utils/redux/slicer/chatSlice';
import { useCreateMessageMutation, useGetChatMessageMutation } from '../../../api-query/chat-api';

import { io } from 'socket.io-client';
import Immutable from '../../../immutable/constant';
import { MessageDisplay, NewMessage } from '../../../api-query/types';
import { useGetProfileAccountQuery } from '../../../api-query/account-api';
import { dateFormatted } from '../../../utils';
import { storeUserMessage } from '../../../utils/redux/slicer/chatUserDisplay';
import { Else, RenderElement } from '../../../common/components/ui/rendeifelse';

type Message={
	userId?:string;
	identity:string;
	type:string;
	message:string;
	action:string;
}
	// const userBubbleMessage: Message[] = [
	// 	{
	// 		identity: 'Bot',
	// 		type: 'user',
	// 		message: 'how are you',
	// 		action: 'sender',
	// 	},
	// 	{
	// 		identity: 'Ramon',
	// 		type: 'bot',
	// 		message: 'Same to you as well',
	// 		action: 'receiver',
	// 	},
	// 	{
	// 		identity: 'Bot',
	// 		type: 'bot',
	// 		message: 'Thanks',
	// 		action: 'sender',
	// 	},
	// 	{
	// 		identity: 'Ramon',
	// 		type: 'bot',
	// 		message: 'See yah',
	// 		action: 'receiver',
	// 	},
	// 	{
	// 		identity: 'Bot',
	// 		type: 'user',
	// 		message: 'Yes ask me anythinh',
	// 		action: 'sender',
	// 	},
	// ];

const socket = io(Immutable.API); // Replace with your server URL


const Chatbot:React.FC = () => {
	const [toggle, setToggle] = useChatToggle();
	const [active, setActive] = useState<boolean>(false);



	// user message

	// const [userMessage, setUserMessage] = useState<Message[]>([]);


	// admin

const userMesasgeBuble = useAppSelector((state: RootState) => state.userMessageBuble);




const getMessageByUser = !isUndefined(userMesasgeBuble) || !isEmpty(userMesasgeBuble) ? userMesasgeBuble : []; 


	const [adminMessage, setAdminMessage] = useState<MessageDisplay[] | []>([
		{
			role: '',
			message: '',
			status: '',
			createdAt: '',
			sender: {
				displayName: 'Test',
			},
			receiver: {
				displayName: 'Test',
			},
		},
	]);




	const user = useAppSelector((state: RootState) => state.authUser);

	const { data: accountUser } = useGetProfileAccountQuery(user?.id as string, { pollingInterval: 5000, refetchOnMountOrArgChange: true, skip: false });	
	

	const chatStatus = useAppSelector((state:RootState)=> state.chatMsg);
	const { onOpen } = useToggleAuth();
	const [, setChatTouch] = useChatOnPoint();
	const dispatch = useAppDispatch();
	const [inputMsg, setInputMsg] = useState<string>('');
	const chatToggle = useAppSelector((state: RootState) => state.chatMsg);
	const [getChatMessage] = useGetChatMessageMutation();
	const [createMessage] = useCreateMessageMutation();

	const containerRef = useRef<HTMLDivElement>(null);

	const adminRef = useRef<HTMLDivElement>(null);


	// let id = user.id as string;





 useEffect(() => {
			const fetchData = async () => {
				try {
					setAdminMessage(getMessageByUser); // Assuming getMessageByUser is an async function
				} catch (error) {
					console.error('Error fetching data:', error);
				}
			};

			fetchData(); // Call fetchData when component mounts
}, [getMessageByUser]); 

	
	
// useEffect(() => {

// 	if(socket){
// 			socket.emit('join');

// 			socket.off('admin message');
// 			// Attach new event listener for admin replies
// 			socket.on('admin message', (adminReply) => {
			
// 				console.log('Received admin reply:', adminReply.message);


// 					const createMessagetoSender = {
// 						userId: adminReply.message.userId,
// 						identity: adminReply.message.identity,
// 						type: adminReply.message.type,
// 						message: adminReply.message.message,
// 						action: 'sender',
// 					};

				

// 				 setToggle(true);
// 			scrollToBottom(); 

// 			setUserMessage((prev) => [...prev, createMessagetoSender]);


// 			});
// 	}

// 	return () => {
// 		// Clean up event listener when component unmounts
// 		socket.off('joinuser');
// 		socket.off('admin message');
// 	};
// }, [socket]);



		// useEffect(() => {
		// 	// Listen for 'get' event from the server
		// 	socket.emit('join');

		// 	// Clean up existing event listener
		// 	socket.off('private message');

		// 	// Attach new event listener
		// 	socket.on('private message', async (receivedMessages) => {
		// 		setToggle(true);

				


		// 		setAdminMessage((prev) => [...prev, receivedMessages.message]);

		// 		dispatch(storeChat({ connectAdmin: true }));

		// 		scrollToBottom();

			

		// 		if (user.role === 0) {
		// 				if (receivedMessages.message.message.includes('might need your assistance')) {
		// 						const recentMessage: NewMessage = {
		// 							sender_id: 'ef30afa2-f600-4dec-bc9a-ba1379dc5e2d',
		// 							receive_id: '369fdcfe-b891-454b-b1f9-a0fa403a38d9',
		// 							message: receivedMessages.message.message,
		// 							type: 'bot',
		// 						};
		// 							await createMessage(recentMessage);
		// 				} else {
		// 						const newMessage: NewMessage = {
		// 							sender_id: accountUser?.account_id as string,
		// 							receive_id: '369fdcfe-b891-454b-b1f9-a0fa403a38d9',
		// 							message: receivedMessages.message.message,
		// 							type: 'user',
		// 						};
		// 							await createMessage(newMessage);
		// 				}
		// 		}
		// 	});

		// 	return () => {
		// 		// Clean up event listener when component unmounts
		// 		socket.off('join');
		// 		socket.off('private message');
		// 	};
		// }, [user.role,socket]);


		// user side







	useEffect(() => {
		if (chatToggle.onActive) {
			setToggle(true);
		} else {
			setToggle(false);
		}
	}, []);

	const onChatOpen = useCallback(() => {
		if (isEmpty(user.accessToken)) {
			onOpen();
			dispatch(storeChat({ urlPath: '/', onActive: true }));
		} else {
	 		dispatch(storeChat({ connectAdmin: false}));
			setToggle(true);
		}
	}, []);

	const onActiceFocus = () => {
		setActive(true);
	};

	const onInputMessage = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputMsg(e.target.value);
	}, []);

	const scrollToBottom = () => {
		if (containerRef.current) {
			const container = containerRef.current;
			const scrollHeightBefore = container.scrollHeight;
			container.scrollTop = scrollHeightBefore;

			// Delay the scroll operation slightly to ensure the new message is fully rendered
			setTimeout(() => {
				const scrollHeightAfter = container.scrollHeight;
				if (scrollHeightAfter > scrollHeightBefore) {
					container.scrollTop = scrollHeightAfter;
				}
			}, 100);
		}

				if (adminRef.current) {
					const containerRef = adminRef.current;
					const scrollHeightBefore = containerRef.scrollHeight;
					containerRef.scrollTop = scrollHeightBefore;

					// Delay the scroll operation slightly to ensure the new message is fully rendered
					setTimeout(() => {
						const scrollHeightAfter = containerRef.scrollHeight;
						if (scrollHeightAfter > scrollHeightBefore) {
							containerRef.scrollTop = scrollHeightAfter;
						}
					}, 100);
				}
	};





	const onKeyInputMsg = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !isEmpty(inputMsg)) {
			onPushMsg();
			setInputMsg('');
		}
	};






	const onPushMsg = useCallback(async () => {
		const getAnswertoQuestion = await getChatMessage({ answer: inputMsg });


		if (!isEmpty(getAnswertoQuestion) && 'data' in getAnswertoQuestion) {

			const answer = getAnswertoQuestion?.data?.answer as string;


			if (answer.includes('Ok will direct you to admin') || answer.includes('Sure admin will reply please wait for a few minutes') || answer.includes('Hold on a second admin saw your reply') && user.role !== 1) {
				console.log('emitted agent');

				// Clean up existing event listener
				socket.off('privateMessage');

	

				if (!chatStatus.connectAdmin){
					// const createMessagetoReceiver = {
					// 	userId: user.id,
					// 	identity: user.displayName,
					// 	type: 'user',
					// 	message: `Hi admin user ${user.displayName} might need your assistance`,
					// 	action: 'sender',
					// };

					// // Emit the privateMessage event to the server
					// socket.emit('privateMessage', createMessagetoReceiver);

					const assistanceMsg = `Hi admin user ${user.displayName} might need your assistance`;

					setMessageState('receiver', assistanceMsg, 'admin');

					dispatch(storeChat({ connectAdmin: true }));

					const currentDate = moment(new Date());

					const dateString = currentDate.format('YYYY-MM-DD HH:mm:ss');

					setAdminMessage((prev) => [
						...prev,
						{
							role: 'sender',
							message: assistanceMsg,
							status: 'unread',
							createdAt: dateString,
							sender: {
								displayName: 'Bot',
							},
							receiver: {
								displayName: 'Dev Me',
							},
						},
					]);

					const recentMessage: NewMessage = {
						sender_id: 'ef30afa2-f600-4dec-bc9a-ba1379dc5e2d',
						receive_id: '369fdcfe-b891-454b-b1f9-a0fa403a38d9',
						message: assistanceMsg,
						type: 'bot',
					};
					await createMessage(recentMessage);
					
					setToggle(true);

						
					dispatch(storeChat({ connectAdmin: true }));

					scrollToBottom();
				}
		}

				if (chatStatus.connectAdmin && user.role === 1) {
						
			

					setMessageState('receiver', inputMsg, 'admin');

						
 
					// const createMessage = {
					// 	userId: user.id,
					// 	identity: user.displayName,
					// 	type: 'admin',
					// 	message: inputMsg,
					// 	action: 'sender',
					// };

					// socket.emit('adminResponse', createMessage);

			
				} 
				if (user.role === 0 && chatStatus.connectAdmin) {
		
					setMessageState('receiver', inputMsg,'admin');
					socket.emit('privateMessage', createMessage);

				}
				
				else {

					
					
					if (user.role === 0 && !chatStatus.connectAdmin) {
				
				
							setMessageState('sender', getAnswertoQuestion?.data?.answer as string, 'bot','Bot');

					}

			
						setMessageState('user', inputMsg);

				
				}
			
		}

			setInputMsg('');
		


		scrollToBottom(); // Scroll to the bottom when a new message is pushed
	}, [inputMsg, user.displayName]);


async function setMessageState(role:string,message:string,type?:string,botName?:string){

	
		const currentDate = moment(new Date());

			const dateString = currentDate.format('YYYY-MM-DD HH:mm:ss');


		setAdminMessage((prev) => [
			...prev,
			{
				role: role,
				message: message,
				status: 'unread',
				createdAt: dateString,
				sender: {
					displayName: !isUndefined(botName) ? botName  : user.displayName, 
				},
				receiver: {
					displayName: 'Dev Me',
				},
			},
		]);

		const newMessage: NewMessage = {
			sender_id: accountUser?.account_id as string,
			receive_id: chatStatus?.sender_id as string,
			message: inputMsg,
			type: type ?? 'user',
		};
		await createMessage(newMessage);
}


	const onCloseChatMsg = useCallback(() => {
		dispatch(storeChat({ urlPath: '/user-dashboard', onActive: false }));
		setToggle(false);
		dispatch(storeChat({ connectAdmin: false,onActive:false }));
		dispatch(storeUserMessage([]));

	}, []);

	const currentTime = moment().format('ddd [at] h:mma');

	return (
		<>
			<RenderIf value={!toggle}>
				<div className='fixed z-50 bottom-10 right-10 w-[20] h-[20] bg-white p-3 rounded-full shadow-md border border-1 border-gray-200 cursor-pointer' onClick={onChatOpen}>
					<SiChatbot size={60} className='relative text-accent animate-move' />
				</div>
			</RenderIf>
			<RenderIf value={toggle}>
				<div
					onClick={onChatOpen}
					className={clsx('fixed z-50 bottom-0 right-5 w-[20rem] h-[25rem] bg-white p-3 shadow-md border border-1 border-gray-200 cursor-pointer', {
						'animate-slideDown': toggle,
					})}
				>
					<div onClick={(e) => e.stopPropagation()} className='flex flex-col h-full justify-between'>
						<div className='flex justify-between'>
							<p className='text-xl font-medium text-navy'>Message</p>
							<p>
								<IoCloseCircleSharp onClick={onCloseChatMsg} size={30} className='text-accent' />
							</p>
						</div>

						{/* {!isEmpty(adminMessage) &&
							adminMessage?.map((value, i) => (
								<div ref={adminRef} className='h-full bg-gray-100 max-h-[17.5rem] = rounded overflow-y-auto pl-5'>
									<div
										key={i}
										className={clsx('flex leading-8 items-center gap-2 w-full', {
											'justify-start': value?.role == 'sender',
											'justify-end': value?.role == 'receiver',
										})}
									>
										<div className='flex'>
											<span className='w-2/12'>
												<RenderIf value={value.role === 'sender'}>
													<span className=' flex justify-center font-medium bg-accent w-[2rem] h-[2rem] rounded-full text-white'>{(value?.sender?.displayName?.slice(0, 1) as string) ?? ''}</span>
												</RenderIf>
											</span>

											<span
												className={clsx('w-8/12 rounded-md px-2 my-5 min-w-[10rem]', {
													'bg-gray-300': value?.role === 'sender',
													'bg-indigo-500': value?.role === 'receiver',
												})}
											>
												<p>{value.message}</p>
												<sub className='ml-2]'>{dateFormatted(value?.createdAt)}</sub>
											</span>
										</div>
									</div>
								</div>
							))} */}

						{/* <RenderIf value={user.role === 1 && !isEmpty(adminMessage)}>
							<div ref={adminRef} className='h-full bg-gray-100 max-h-[17.5rem] = rounded overflow-y-auto pl-5'>
								{!isEmpty(adminMessage) &&
									adminMessage?.map((value,i) => (
										<div
											key={i}
											className={clsx('flex leading-8 items-center gap-2 w-full', {
												'justify-start': value?.role == 'sender',
												'justify-end': value?.role == 'receiver',
											})}
										>
											<div className='flex'>
												<span className='w-2/12'>
													<RenderIf value={value.role === 'sender'}>
														<span className=' flex justify-center font-medium bg-accent w-[2rem] h-[2rem] rounded-full text-white'>{value?.sender?.displayName.slice(0, 1) as string ?? ''}</span>
													</RenderIf>
												</span>

												<span
													className={clsx('w-8/12 rounded-md px-2 my-5 min-w-[10rem]', {
														'bg-gray-300': value?.role === 'sender',
														'bg-indigo-500': value?.role === 'receiver',
													})}
												>
													<p>{value.message}</p>
													<sub className='ml-2]'>{dateFormatted(value?.createdAt)}</sub>
												</span>
											</div>
										</div>
									))}
							</div>
						</RenderIf> */}

					
							<div ref={containerRef} className='h-full bg-gray-100 max-h-[17.5rem] = rounded overflow-y-auto pl-5'>
								{adminMessage?.map((value, i) => (
									<div
										key={i}
										className={clsx('flex leading-8 items-center gap-2 w-full', {
											'justify-start': value?.role == 'sender',
											'justify-end': value?.role == 'receiver',
										})}
									>
										<div className='flex'>
											<span className='w-2/12'>
												<RenderIf value={value.role === 'sender'}>
													<span className=' flex justify-center font-medium bg-accent w-[2rem] h-[2rem] rounded-full text-white'>{(value?.sender?.displayName?.slice(0, 1) as string) ?? ''}</span>
												</RenderIf>
											</span>

											<span
												className={clsx('w-8/12 rounded-md px-2 my-5 min-w-[10rem]', {
													'bg-gray-300': value?.role === 'sender',
													'bg-indigo-500': value?.role === 'receiver',
												})}
											>
												<p>{value.message}</p>
												<sub className='ml-2]'>{dateFormatted(value?.createdAt)}</sub>
											</span>
										</div>
									</div>
								))}
							</div>
					
						{/* <div ref={containerRef}></div> */}

						<div className='relative'>
							<textarea className='-ml-1 border-none borderGray' name='message' value={inputMsg} cols={32} rows={1} placeholder='Input a message' onKeyDown={onKeyInputMsg} onChange={onInputMessage} onFocus={onActiceFocus}></textarea>

							<RenderIf value={active}>
								<IoMdSend size={25} className='absolute right-2 top-2 hover:text-indigo-800' onClick={onPushMsg} onMouseOver={onActiceFocus} />
							</RenderIf>
						</div>
					</div>
				</div>
				<div></div>
			</RenderIf>
		</>
	);
}

export default Chatbot
