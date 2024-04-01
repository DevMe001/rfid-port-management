import { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { enqueueSnackbar } from 'notistack';
import { addUser } from '../../utils/redux/slicer/authSlice';
import waitSec from '../../utils/setTimeout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../utils/redux/store';
import Headers from './layout/homepage-headers';
import HomepageMain from './layout/homepage-main';
import RenderIf from '../../common/components/ui/render-if';
import FooterMd from './layout/homepage-footer-md';
import FooterXS from './layout/homepage-footer-sm';
import { onToggleNavHomepageMobile } from '../../utils/hooks/globa.state';
import { isUndefined } from 'lodash';


const HomePage = () => {


		const [toggle] = onToggleNavHomepageMobile();


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

			dispatch(
				addUser({
					id: data.profile.id,
					displayName: data.profile.displayName,
					email: !isUndefined(data.profile.emails) ? data.profile.emails[0].value : data.profile.displayName,
					picture: data.profile.photos[0].value,
					accessToken: data.accessToken,
				}),
			);

			  navigate('/user-dashboard');
			} else {
			  enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 5000 });
			}
		  }
		}
	
		getUserProfile();
	  }, [location.search, enqueueSnackbar, navigate]);




	
  return (
		<div className='relative grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh repeat(2,1fr) 10vh' }}>
			<Headers />
			<HomepageMain />
			<RenderIf value={!toggle}>
				<FooterMd />
				<FooterXS />
			</RenderIf>

		</div>
	);
};

export default HomePage;
