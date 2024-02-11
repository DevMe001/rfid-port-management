import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../common/components/error-page';
import Login from '../modules/onboarding-flow/login.module';


const Router = createBrowserRouter([
    {
        errorElement:<ErrorPage/>,
        children:[
            {
                path:'/',
                element:<Login/>
            }
        ]
    }
  ]);
export default Router;