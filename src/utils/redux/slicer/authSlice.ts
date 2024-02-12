import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUser  {
    id:number | string
    displayName:string;
    email:string;
    picture:string;
    accessToken:string;
}


const initialState: IUser = {
    id:"",
    displayName: "",
    email: "",
    picture: "",
    accessToken: "",
};



const authSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        addUser : (_state,action:PayloadAction<IUser>) =>{
            return action.payload;
        },
        revertUser : () =>{
            return initialState;
        },
    }
});

export const { addUser,revertUser } = authSlice.actions;


export default authSlice.reducer;