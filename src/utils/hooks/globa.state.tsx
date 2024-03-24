import {createGlobalState} from 'react-use';


export const onToggleNavHomepageMobile = createGlobalState<boolean>(false);
export const onToggleModal= createGlobalState<boolean>(false);
export const onToggleBookingModal = createGlobalState<boolean>(false);
export const onActiveMode = createGlobalState<{isActive:boolean,index?:number}>({
  isActive:false
});


export const useSeatTaken = createGlobalState<boolean>(false);
