import React, { useCallback } from 'react'
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

    const onSigoutOut = () =>{

        enqueueSnackbar('Logout successfully', { variant: 'success', autoHideDuration: 5000 });
        waitSec(3000);
        dispatch(revertUser());
        navigate('/');
    }




  return [onHandlerNavigationEvent];
}

export default useNavigationHandler