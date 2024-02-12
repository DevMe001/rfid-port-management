
import { Navigate, } from 'react-router-dom';
import { useAppSelector,RootState } from '../../utils/redux/store'
import { isEmpty } from 'lodash';

type Props = {
    children:React.ReactNode
}

const PrivateRoute = ({children}:Props ) => {

const authUser = useAppSelector((state:RootState) => state.authUser);


if(!isEmpty(authUser.accessToken)){
   return children;
}
else{
    return <Navigate replace to={"/"} />
}


  
}

export default PrivateRoute