import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../common/components/error-page';
import Login from '../modules/onboarding-flow/login.module';
import Dasboard from '../modules/dashboard';
import withSnackbar from '../common/components/notistack';


const LoginwithSnackbar = withSnackbar(Login);


const Router = createBrowserRouter([
    {
        errorElement:<ErrorPage/>,
        children:[
            {
                path:'/',
                element:<LoginwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000}/>
            },
            {
                path:'/dashboard',
                element:<Dasboard/>
            }
        ]
    }
  ]);
export default Router;