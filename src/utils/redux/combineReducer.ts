import { combineReducers } from "redux";
import { accountProfileServices } from "../../api-query/account-api";
import { authService } from "../../api-query/auth-api";
import { chatService } from "../../api-query/chat-api";
import { paymentService } from "../../api-query/payment-api";
import { personalInformationService } from "../../api-query/personal-details.api";
import { scheduleService } from "../../api-query/schedule-list.api";
import passengerformSlice from "./slicer/passengerformSlice";
import authReducers from './slicer/authSlice';
import passengerReducers from './slicer/passengerSlice';
import paymentReducers from './slicer/paymentSlice';
import chatReducer from './slicer/chatSlice';
import userMessageDisplayReducer from './slicer/chatUserDisplay';
import { rfidApiService } from "../../api-query/rfid-api";
import { vehiclesApiService } from "../../api-query/vehicle-api";
import { walletApiService } from "../../api-query/wallet-api";
import { vehicleCategorieServiceApi } from '../../api-query/vehiclescategory-services';
import { passengerApiService } from "../../api-query/passengerapi-service";
import { bookingApiService } from "../../api-query/bookingapi-service";
import { transactionService } from "../../api-query/transaction.api.services";

const rtkAPI = {
	[authService.reducerPath]: authService.reducer,
	[personalInformationService.reducerPath]: personalInformationService.reducer,
	[accountProfileServices.reducerPath]: accountProfileServices.reducer,
	[paymentService.reducerPath]: paymentService.reducer,
	[scheduleService.reducerPath]: scheduleService.reducer,
	[chatService.reducerPath]: chatService.reducer,
	[rfidApiService.reducerPath]: rfidApiService.reducer,
	[vehiclesApiService.reducerPath]: vehiclesApiService.reducer,
	[walletApiService.reducerPath]: walletApiService.reducer,
	[vehicleCategorieServiceApi.reducerPath]: vehicleCategorieServiceApi.reducer,
	[passengerApiService.reducerPath]: passengerApiService.reducer,
	[bookingApiService.reducerPath]: bookingApiService.reducer,
	[transactionService.reducerPath]: transactionService.reducer
};

const slicer = {
	authUser: authReducers,
	countPassenger: passengerReducers,
	passengerFormDetails: passengerformSlice,
	paymentProcess: paymentReducers,
	chatMsg: chatReducer,
	userMessageBuble:userMessageDisplayReducer
};



const rootReducers = combineReducers({
	...rtkAPI,
	...slicer,
});


export default rootReducers;