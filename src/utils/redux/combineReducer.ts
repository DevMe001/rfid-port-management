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

const rtkAPI = {
	[authService.reducerPath]: authService.reducer,
	[personalInformationService.reducerPath]: personalInformationService.reducer,
	[accountProfileServices.reducerPath]: accountProfileServices.reducer,
	[paymentService.reducerPath]: paymentService.reducer,
	[scheduleService.reducerPath]: scheduleService.reducer,
	[chatService.reducerPath]: chatService.reducer,
	[rfidApiService.reducerPath]: rfidApiService.reducer,
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