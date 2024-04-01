import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../common/components/error-page';
import Login from '../modules/onboarding-flow/login.module';
import Dasboard from '../modules/dashboard';
import withSnackbar from '../common/components/notistack';
import PrivateRoute from './private/protected-route';
import PublicRoute from './public';
import HomePage from '../modules/onboarding-flow/homepage';
import BuyerDashboard from '../modules/buyers/dashboard/user-dashboard';
import BuyerBooking from '../modules/buyers/booking';
import BuyerBookingById from '../modules/buyers/addbooking';
import Payment from '../modules/buyers/payment';


const LoginwithSnackbar = withSnackbar(Login);
const HomewithSnachbard = withSnackbar(HomePage);
const BuyerDashboardwithSnachbard = withSnackbar(BuyerDashboard);
const BuyerBookingwithSnackbar = withSnackbar(BuyerBooking);
const BuyerBookingByIdwithSnackbar = withSnackbar(BuyerBookingById);
const PaymentwithSnackbar = withSnackbar(Payment);




const Router = createBrowserRouter([
	{
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <HomewithSnachbard anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />,
			},
			{
				path: '/login',
				element: (
					<PublicRoute url={'/dashboard'}>
						<LoginwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />
					</PublicRoute>
				),
			},
			{
				path: '/booking/:bookId',
				element: <BuyerBookingByIdwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />,
			},
			{
				path: '/booking/:bookId/payment',
				element: (
					<PrivateRoute>
						<PaymentwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />
					</PrivateRoute>
				),
			},
			{
				path: '/booking',
				element: <BuyerBookingwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />,
			},
			{
				path: '/user-dashboard',
				element: (
					<PrivateRoute>
						<BuyerDashboardwithSnachbard anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />
					</PrivateRoute>
				),
			},
			{
				path: '/dashboard',
				element: (
					<PrivateRoute>
						<Dasboard />
					</PrivateRoute>
				),
			},
		],
	},
]);
export default Router;