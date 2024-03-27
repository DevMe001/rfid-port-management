import { useAppDispatch } from '../redux/store'
import { revertUser } from '../redux/slicer/authSlice';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import waitSec from '../setTimeout';

const useNavigationHandler = () => {

   const dispatch = useAppDispatch();

   const navigate = useNavigate();
    


    const onHandlerNavigationEvent = (label:string)=>{


        switch(label.replace(' ','').toLowerCase()){
            case 'signout':
             onSigoutOut();
            break;
            default:
            console.log('no route')

        }

    }

    const onSigoutOut = async() =>{

        enqueueSnackbar('Logout successfully', { variant: 'success', autoHideDuration: 5000 });
        await waitSec(3000);
        dispatch(revertUser());
        localStorage.removeItem('persist:port-management');
        
        navigate('/');
    }




  return [onHandlerNavigationEvent];
}

export default useNavigationHandler