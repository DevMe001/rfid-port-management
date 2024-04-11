import {createGlobalState} from 'react-use';

export const onToggleNavHomepageMobile = createGlobalState<boolean>(false);
export const onToggleModal= createGlobalState<boolean>(false);
export const onToggleBookingModal = createGlobalState<boolean>(false);

export const onRfidModal = createGlobalState<boolean>(false);


export const onActiveMode = createGlobalState<{isActive:boolean,index?:number}>({
  isActive:false
});


export const useSeatTaken = createGlobalState<boolean>(false);

export const useSelectIndex = createGlobalState<number>(0);

export const onToggleAuthBox = createGlobalState<boolean>(false);

export const useGlobaLoader = createGlobalState<boolean>(false);

export const useChatToggle = createGlobalState<boolean>(false);

export const useChatOnPoint = createGlobalState<boolean>(false);


export const useGlobalUrlPath = createGlobalState<string>('/user-dashboard');

