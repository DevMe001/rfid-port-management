import {configureStore} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { combineReducers } from "redux";
import logger from 'redux-logger';
import {FLUSH, PAUSE, PERSIST, Persistor, REGISTER, REHYDRATE, persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authService } from '../../api-query/auth-api';
import authReducers from './slicer/authSlice';


// creates reducers
const rootReducers = combineReducers({
    // define api here
    [authService.reducerPath] : authService.reducer,
    authUser: authReducers,
})
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
                REGISTER
            ]
        }
    }).concat(
        // define midleware
        authService.middleware,
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