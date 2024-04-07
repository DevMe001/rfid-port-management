import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

interface Chat{
  urlPath?:string;
  onActive?:boolean;
  connectAdmin?:boolean;
  sender_id?:string;
}


const initialState: Chat = {
	urlPath: '/user-dashboard',
	onActive: false,
	connectAdmin:false,
};


const chatSlice = createSlice({
  name:'chat-message',
  initialState,
  reducers:{
    storeChat:(_state,action:PayloadAction<Chat>)=>{
      return action.payload;
     },
  },
  extraReducers:(builder)  => {
    builder.addCase(PURGE,()=>{
       return initialState;
    })
  }
})


export const {storeChat} = chatSlice.actions;

export default chatSlice.reducer;