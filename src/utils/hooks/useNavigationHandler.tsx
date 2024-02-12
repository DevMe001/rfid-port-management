import React, { useCallback } from 'react'
import { useAppDispatch } from '../redux/store'
import { revertUser } from '../redux/slicer/authSlice';
import { useNavigate } from 'react-router-dom';

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


        console.log('get logout')
        dispatch(revertUser());
        navigate('/');
    }




  return [onHandlerNavigationEvent];
}

export default useNavigationHandler