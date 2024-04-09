import React, { useCallback, useState, useEffect, useRef } from 'react';
import { SiChatbot } from 'react-icons/si';
import { useChatToggle } from '../../../utils/hooks/globa.state';
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
import { useGetProfileAccountQuery, useGetProfileAdminRoleQuery } from '../../../api-query/account-api';
import { dateFormatted } from '../../../utils';
import { storeUserMessage } from '../../../utils/redux/slicer/chatUserDisplay';
import Lottie from 'lottie-react';
import typingAnimation from '../../../lotties/typing.json'




export const socket = io(Immutable.API); // Replace with your server URL


const Chatbot:React.FC = () => {
	const [toggle, setToggle] = useChatToggle();
	const [active, setActive] = useState<boolean>(false);



	// user message

	// const [userMessage, setUserMessage] = useState<Message[]>([]);


	// admin

const userMesasgeBuble = useAppSelector((state: RootState) => state.userMessageBuble);




const getMessageByUser = !isUndefined(userMesasgeBuble) || !isEmpty(userMesasgeBuble) ? userMesasgeBuble : []; 

// user state
	const [userMessage, setUserMessage] = useState<MessageDisplay[] | []>([
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

// admin state
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


	const { data: adminRole } = useGetProfileAdminRoleQuery<any>(undefined,{ pollingInterval: 5000, refetchOnMountOrArgChange: true, skip: false });
	

	const chatStatus = useAppSelector((state:RootState)=> state.chatMsg);
	const { onOpen } = useToggleAuth();

	const dispatch = useAppDispatch();
	const [inputMsg, setInputMsg] = useState<string>('');
	const chatToggle = useAppSelector((state: RootState) => state.chatMsg);
	const [getChatMessage] = useGetChatMessageMutation();
	const [createMessage] = useCreateMessageMutation();
	const [onMessage,setOnMEssage] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const adminRef = useRef<HTMLDivElement>(null);


	// let id = user.id as string;





 useEffect(() => {
			const fetchData = async () => {
				try {
					scrollToBottom();
					setAdminMessage(getMessageByUser); 
					setUserMessage(getMessageByUser);
							
					
				} catch (error) {
					console.error('Error fetching data:', error);
				}
			};

			fetchData(); // Call fetchData when component mounts
}, [getMessageByUser]); 

	
	
useEffect(() => {

	if(socket){
			socket.emit('join');

			socket.off('admin message');
			// Attach new event listener for admin replies
			socket.on('admin message', (adminReply) => {
			
				console.log('Received admin reply:', adminReply.message);

					if (adminReply.message.message == 'typing' && user.role === 0) {
						setOnMEssage(true);
					} else {
						setOnMEssage(false);
						if (!isEmpty(adminReply.message.role)) {
							setToggle(true);
							scrollToBottom();

							if (!isEmpty(adminReply.message)) {
								setUserMessage((prev) => [...prev, adminReply.message]);
							}
						}
					}
	

		

			});
	}

	return () => {
		// Clean up event listener when component unmounts
		socket.off('join');
		socket.off('admin message');
	};
}, [socket]);



		useEffect(() => {
			// Listen for 'get' event from the server
			socket.emit('join');

			// Clean up existing event listener
			socket.off('private message');

			// Attach new event listener
			socket.on('private message', async (receivedMessages) => {
				setToggle(true);


				console.log(receivedMessages,'get retrieve message');

				
		
				if (receivedMessages.message.message == 'typing' && user.role === 1){
					setOnMEssage(true);
				}else{
					setOnMEssage(false);
						if (!isEmpty(receivedMessages.message.role)) {
							setAdminMessage((prev) => [...prev, receivedMessages.message]);

							dispatch(storeChat({ connectAdmin: true, sender_id: receivedMessages.message.userId }));

							scrollToBottom();
						}
				}
				
			

				
			});

			return () => {
				// Clean up event listener when component unmounts
				socket.off('join');
				socket.off('private message');
			};
		}, [socket]);


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

	// user is typing

 useEffect(() => {
		let typingTimer: NodeJS.Timeout;

		const handleKeyDown = () => {
			clearTimeout(typingTimer);
			if (!onMessage && chatStatus.connectAdmin) {
				console.log('Typing started');
					if(user.role === 0){
						socket.off('adminResponse');
						socket.emit('privateMessage', { message: 'typing' });
					}
						if (user.role === 1) {
							socket.off('privateMessage');

							socket.emit('adminResponse', { message: 'typing' });
						}
			}
		};

		const handleKeyUp = () => {

			if (chatStatus.connectAdmin) {
						clearTimeout(typingTimer);
						typingTimer = setTimeout(() => {
						
							if(user.role === 0){
							socket.off('adminResponse');

								socket.emit('privateMessage', { message: 'stop' });
							}	if (user.role === 1) {
								socket.off('privateMessage');

								socket.emit('adminResponse', { message: 'stop' });
							}

							console.log('Typing stopped');
						}, 1000);
			}
		
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
 }, [onMessage, socket]);











	const onInputMessage = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInputMsg(e.target.value);

				

		
			
		},
		[socket],
	);




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

	

				if (chatStatus.connectAdmin == false){
					// const createMessagetoReceiver = {
					// 	userId: user.id,
					// 	identity: user.displayName,
					// 	type: 'user',
					// 	message: `Hi admin user ${user.displayName} might need your assistance`,
					// 	action: 'sender',
					// };

					// // Emit the privateMessage event to the server
					// socket.emit('privateMessage', createMessagetoReceiver);

					const assistanceMsg = `Hi admin ${user.displayName} might need your assistance,You can reply now and ${user.displayName} will receive it`;

					setMessageState('receiver', assistanceMsg, 'admin');

					dispatch(storeChat({ connectAdmin: true }));

					const currentDate = moment(new Date());

					const dateString = currentDate.format('YYYY-MM-DD HH:mm:ss');

							const createMessagetoReceiver = {
								role: 'sender',
								userId:accountUser?.account_id as string,
								senderMsg:inputMsg,
								message: assistanceMsg,
								status: 'unread',
								createdAt: dateString,
								sender: {
									displayName: 'Bot',
								},
								receiver: {
									displayName: adminRole?.displayName,
								},
							};

			


						setAdminMessage((prev) => [...prev, createMessagetoReceiver]);

				
				
						socket.emit('privateMessage', createMessagetoReceiver);
					
					console.log('are you emitted')
						console.log('erceiver emit', inputMsg);

				
				}
		}

				if (chatStatus.connectAdmin && user.role === 1) {
						
			

					setMessageState('sender', inputMsg, 'admin');

						console.log('erceiver emit', inputMsg);
						
 
					// const createMessage = {
					// 	userId: user.id,
					// 	identity: user.displayName,
					// 	type: 'admin',
					// 	message: inputMsg,
					// 	action: 'sender',
					// };

					//  socket.emit('adminResponse', createMessage);

			
				} 
				if (user.role === 0 && chatStatus.connectAdmin) {
		
					setMessageState('receiver', inputMsg,'admin');
					
						console.log('are you emit',inputMsg);

				}
				
				else {

					
					
					if (user.role === 0 && !chatStatus.connectAdmin) {
				
				
							setMessageState('sender', getAnswertoQuestion?.data?.answer as string, 'bot','Bot');

							
						console.log('bot emit');
						console.log('erceiver emit', inputMsg);
							


					}
					if(user.role === 0){
						 setMessageState('receiver', inputMsg);
					}

			
				
				}
			
		}

			setInputMsg('');
		


		scrollToBottom(); // Scroll to the bottom when a new message is pushed
	}, [inputMsg, user.displayName]);


async function setMessageState(role:string,message:string,type?:string,botName?:string){

	
		const currentDate = moment(new Date());

			const dateString = currentDate.format('YYYY-MM-DD HH:mm:ss');


		if (user.role == 0) {

			const userReply = {
				role: role,
				message: message,
				status: chatStatus.onActive ? 'read' : 'unread',
				createdAt: dateString,
				sender: {
					displayName: !isUndefined(botName) ? botName : user.displayName,
				},
				receiver: {
					displayName: adminRole?.displayName,
				},
			};

				setUserMessage((prev) => [...prev, userReply]);

					if (isUndefined(botName)) {
							const newMessage: NewMessage = {
								sender_id: accountUser?.account_id as string,
								receive_id: adminRole?.account_id as string,
								message: inputMsg,
								status: chatStatus.onActive ? 'read' : 'unread',
								type: type ?? 'user',
							};

							if(chatStatus.connectAdmin){
								
								await createMessage(newMessage);

								const createMessagetoReceiver = {
									role: 'sender',
									userId: accountUser?.account_id as string,
									senderMsg: inputMsg,
									message: message,
									status: chatStatus.onActive ? 'read' : 'unread',
									createdAt: dateString,
									sender: {
										displayName: user.displayName,
									},
									receiver: {
										displayName: adminRole?.displayName,
									},
								};

							socket.emit('privateMessage', createMessagetoReceiver);
							}
					}
		
		}

		if(user.role === 1){

			const adminReply = {
				role: role,
				message: message,
				status: chatStatus.onActive ? 'read' : 'unread',
				createdAt: dateString,
				sender: {
					displayName: !isUndefined(botName) ? botName : user.displayName,
				},
				receiver: {
					displayName: adminRole?.displayName,
				},
			};

				setAdminMessage((prev) => [...prev, adminReply]);

				const newMessage: NewMessage = {
					sender_id: accountUser?.account_id as string,
					receive_id: chatStatus?.sender_id as string,
					message: inputMsg,
					status: chatStatus.onActive ? 'read' : 'unread',
					type: type ?? 'user',
				};

				await createMessage(newMessage);
			 socket.emit('adminResponse', adminReply);
		}
	


		
}


	const onCloseChatMsg = useCallback(() => {
		dispatch(storeChat({ urlPath: '/user-dashboard', onActive: false }));
		setToggle(false);
		dispatch(storeChat({ connectAdmin: false,onActive:false }));
		dispatch(storeUserMessage([]));

	}, []);


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

						<RenderIf value={user.role === 1 && !isEmpty(adminMessage)}>
							<div ref={adminRef} className='h-full bg-gray-100 max-h-[17.5rem] = rounded overflow-y-auto pl-5'>
								{!isEmpty(adminMessage) &&
									adminMessage?.map((value, i) => (
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
													<sub className='ml-2]'>{!isEmpty(value.createdAt) ? dateFormatted(value?.createdAt) : ''}</sub>
												</span>
											</div>
										</div>
									))}
							</div>
						</RenderIf>
						<div></div>
						<RenderIf value={user.role == 0}>
							<div ref={containerRef} className='h-full bg-gray-100 max-h-[17.5rem] = rounded overflow-y-auto pl-5'>
								{userMessage?.map((value, i) => (
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
												<sub className='ml-2]'>{!isEmpty(value.createdAt) ? dateFormatted(value?.createdAt) : ''}</sub>
											</span>
										</div>
									</div>
								))}
							</div>
						</RenderIf>

						{/* <div ref={containerRef}></div> */}

						<div className='relative'>
							{onMessage && (
								<div>
									<Lottie animationData={typingAnimation} loop={true} />
									<p>Someone is typing....</p>
								</div>
							)}
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
