import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../common/components/error-page';
import Login from '../modules/onboarding-flow/login.module';
import Dasboard from '../modules/admin/dashboard';
import withSnackbar from '../common/components/notistack';
import PrivateRoute from './private/protected-route';
import PublicRoute from './public';
import HomePage from '../modules/onboarding-flow/homepage';
import BuyerDashboard from '../modules/buyers/dashboard/user-dashboard';
import BuyerBooking from '../modules/buyers/booking';
import BuyerBookingById from '../modules/buyers/addbooking';
import Payment from '../modules/buyers/payment';
import RFIDSlot from '../modules/admin/rfid-slot';
import Vehicle from '../modules/admin/vehicle';
import Schedule from '../modules/admin/schedule';
import BookingSchedule from '../modules/admin/booking-list';
import Passengers from '../modules/admin/passengers';
import UserControl from '../modules/admin/users';
import PersonalDetails from '../modules/admin/users/personal';
import Wallet from '../modules/admin/wallet';
import VehicleTypeCategories from '../modules/admin/vehicle/categories';
import PaymentTransaction from '../modules/admin/dock-payment';




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
					<PublicRoute url={'/admin-dasboard'}>
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
				path: '/admin-dashboard',
				element: (
					<PrivateRoute>
						<Dasboard />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/rfid-slot',
				element: (
					<PrivateRoute>
						<RFIDSlot />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/vehicle',
				element: (
					<PrivateRoute>
						<Vehicle />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/vehicle/categories',
				element: (
					<PrivateRoute>
						<VehicleTypeCategories />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/schedule',
				element: (
					<PrivateRoute>
						<Schedule />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/schedule/:id',
				element: (
					<PrivateRoute>
						<Schedule />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/booking',
				element: (
					<PrivateRoute>
						<BookingSchedule />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/passenger',
				element: (
					<PrivateRoute>
						<Passengers />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/user',
				element: (
					<PrivateRoute>
						<UserControl />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/personal',
				element: (
					<PrivateRoute>
						<PersonalDetails />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/personal/:id',
				element: (
					<PrivateRoute>
						<PersonalDetails />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/ewallet',
				element: (
					<PrivateRoute>
						<Wallet />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/ewallet/:id',
				element: (
					<PrivateRoute>
						<Wallet />
					</PrivateRoute>
				),
			},
			{
				path: '/admin-dasboard/dock-payment',
				element: (
					<PrivateRoute>
						<PaymentTransaction />
					</PrivateRoute>
				),
			},
		],
	},
]);
export default Router;