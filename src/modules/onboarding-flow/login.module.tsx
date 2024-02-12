

import Immutable from '../../immutable/constant';
import PortPng from '../../assets/login/port.png';
import { useEffect } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';;
import { enqueueSnackbar } from 'notistack';
import waitSec from '../../utils/setTimeout';
import { useAppDispatch } from '../../utils/redux/store';
import { addUser } from '../../utils/redux/slicer/authSlice';
import GoogleSignIn from '../../common/widget/google.icon';
import FacebookIcon from '../../common/widget/fb.icon';

function Login() {
 
	const location = useLocation();
	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	


	useEffect(() => {
		async function getUserProfile() {
		  const searchParams = new URLSearchParams(location.search);
		  const encryptedQueryString = searchParams.get('qs');
	
		  // Check if encryptedQueryString is not null before decrypting
		  if (encryptedQueryString) {
			const decData = CryptoJS.enc.Base64.parse(encryptedQueryString).toString(CryptoJS.enc.Utf8);
			const bytes = CryptoJS.AES.decrypt(decData, 'authenticate').toString(CryptoJS.enc.Utf8);
			const data = JSON.parse(bytes);

			console.log(data,'get data');
	
			if (data.accessToken) {

				enqueueSnackbar('Login success', { variant: 'success', autoHideDuration: 5000 });
				await waitSec(3000);

			dispatch(addUser({
				id:data.profile.id,
				displayName:data.profile.displayName,
				email:data.profile.email,
				picture:data.profile.photos[0].value,
				accessToken:data.accessToken
			}))

			  navigate('/dashboard');
			} else {
			  enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 5000 });
			}
		  }
		}
	
		getUserProfile();
	  }, [location.search, enqueueSnackbar, navigate]);


  return (
		<>
		<div className='grid grid-cols-1 md:grid-cols-2  w-full h-screen place-items-center'>
		<div className='bg-indigo-600 h-full text-white w-[50vw]'>
			<div className='flex flex-col justify-center items-center h-full'>
				<img src={PortPng} alt="port-png"/>
				<h1 className='my-4'>Port Management</h1>
			</div>
		</div>
			
		  <div>
			<FacebookIcon/>
			<GoogleSignIn/>
		  </div>
			
		</div>
		</>
	);
}

export default Login
