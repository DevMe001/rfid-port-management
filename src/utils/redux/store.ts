import {configureStore} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import logger from 'redux-logger';
import {FLUSH, PAUSE, PERSIST, PURGE, Persistor, REGISTER, REHYDRATE, persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authService } from '../../api-query/auth-api';
import { scheduleService } from '../../api-query/schedule-list.api';
import { personalInformationService } from '../../api-query/personal-details.api';
import { accountProfileServices } from '../../api-query/account-api';
import { paymentService } from '../../api-query/payment-api';
import { chatService } from '../../api-query/chat-api';
import rootReducers from './combineReducer';
import { rfidApiService } from '../../api-query/rfid-api';


// create persistor key
const peristorConfig = {
    key:'port-management',
    storage
}

// define persistor key and reducers
const persistorReducer = persistReducer(peristorConfig,rootReducers);


// create stores configurations
const store = configureStore({
    reducer:persistorReducer,
    middleware:(response) => response({
        serializableCheck:{
            ignoredActions:[
                FLUSH,
                REHYDRATE,
                PAUSE,
                PERSIST,
                REGISTER,
                PURGE
            ]
        }
    }).concat(
        // define midleware
        authService.middleware,
        scheduleService.middleware,
        personalInformationService.middleware,
        accountProfileServices.middleware,
        paymentService.middleware,
        chatService.middleware,
        rfidApiService.middleware,
        logger
    ),
    devTools:process.env.NODE_ENV != 'production'

})

// invokes persistor store
export const persistorStore:Persistor = persistStore(store)
  

// create type of stores
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// create hooks for store
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = ()=> useDispatch<AppDispatch>();


export default store;