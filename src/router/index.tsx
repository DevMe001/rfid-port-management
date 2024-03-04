import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../common/components/error-page';
import Login from '../modules/onboarding-flow/login.module';
import Dasboard from '../modules/dashboard';
import withSnackbar from '../common/components/notistack';
import PrivateRoute from './private/protected-route';
import PublicRoute from './public';
import HomePage from '../modules/onboarding-flow/homepage';


const LoginwithSnackbar = withSnackbar(Login);
const HomewithSnachbard = withSnackbar(HomePage);


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