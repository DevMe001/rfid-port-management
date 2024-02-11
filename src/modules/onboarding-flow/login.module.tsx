

import Immutable from '../../immutable/constant';
import PortPng from '../../assets/login/port.png';
import { useEffect } from 'react';
import {useLocation, useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';;
import qs from 'qs';

function Login() {
 
	const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const encryptedQueryString = searchParams.get('qs');

	console.log(encryptedQueryString);


    // Check if encryptedQueryString is not null before decrypting
    if (encryptedQueryString) {
		const decData = CryptoJS.enc.Base64.parse(encryptedQueryString).toString(CryptoJS.enc.Utf8);
		const bytes = CryptoJS.AES.decrypt(decData, 'authenticate').toString(CryptoJS.enc.Utf8);


		console.log(JSON.parse(bytes));
     
    }



const signInFacebook = async()=>{
		window.location.href = 	`${Immutable.API}/auth/facebook`;
}
		

const signInGoogle = async()=>{
	window.location.href = 	`${Immutable.API}/auth/google`;
}

  return (
		<>
		<div className='grid grid-cols-2  w-full h-screen place-items-center'>
		<div className='bg-indigo-600 h-full text-white w-[50vw]'>
			<div className='flex flex-col justify-center items-center h-full'>
				<img src={PortPng} alt="port-png"/>
				<h1 className='my-4'>Port Management</h1>
			</div>
		</div>
			<div>
				<div className='flex flex-col gap-2'>
				<button className='btn bg-blue-800 text-white font-medium' onClick={signInFacebook}>Facebook</button>
				<button className='btn bg-red-800 text-white font-medium' onClick={signInGoogle}>Sign in with Google</button>

				</div>
			</div>
		</div>
		</>
	);
}

export default Login
