import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { enqueueSnackbar } from 'notistack';
import { addUser } from '../../utils/redux/slicer/authSlice';
import waitSec from '../../utils/setTimeout';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from '../../utils/redux/store';
import HomepageMain from './layout/homepage-main';
import { isUndefined } from 'lodash';
import LoaderSpinner from '../../common/widget/loader';
import withLayoutWrapper from './components/layout-wrapper';


const HomePage:React.FC = () => {


		const location = useLocation();
		const navigate = useNavigate();

		const dispatch = useAppDispatch();


		const chatUrl = useAppSelector((state:RootState) => state.chatMsg);

	

	
	useEffect(() => {
		async function getUserProfile() {
		  const searchParams = new URLSearchParams(location.search);
		  const encryptedQueryString = searchParams.get('qs');
	
		  // Check if encryptedQueryString is not null before decrypting
		  if (encryptedQueryString) {
			const decData = CryptoJS.enc.Base64.parse(encryptedQueryString).toString(CryptoJS.enc.Utf8);
			const bytes = CryptoJS.AES.decrypt(decData, 'authenticate').toString(CryptoJS.enc.Utf8);
			const data = JSON.parse(bytes);

	
		
	
			if (data.accessToken) {

		

				enqueueSnackbar('Login success', { variant: 'success', autoHideDuration: 5000 });
				await waitSec(3000);

			dispatch(
				addUser({
					id: data.profile.id,
					displayName: data.profile.displayName,
					email: !isUndefined(data.profile.emails) ? data.profile.emails[0].value : data.profile.displayName,
					picture: data.profile.photos[0].value,
					accessToken: data.accessToken,
					role: data.role,
				}),
			);

			
					if(data.role == 1){
								setLoader(true);
								await waitSec(3000);
								setLoader(false);

						navigate('/admin-dashboard');
					}else{
								setLoader(true);
								await waitSec(3000);
								setLoader(false);

						 navigate(chatUrl?.urlPath ?? '/user-dashboard');
					}
			 
			} else {
			  enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 5000 });
			}
		  }
		}
	
		getUserProfile();
	  }, [location.search, enqueueSnackbar, navigate]);



	const [load, setLoader] = useState<boolean>(false);

	
  return (
		<div>
			<HomepageMain />
			<LoaderSpinner load={load} width='w-screen' />
		</div>
	);
};

export default withLayoutWrapper(HomePage);
