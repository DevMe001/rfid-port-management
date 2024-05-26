import {createGlobalState} from 'react-use';
import { Account, PersonalInformation, Schedules, VehicleType, Vehicles } from '../../api-query/types';
import { FilterDateProps } from '../../modules/admin/trasnaction/invoice-filter';

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


export const useSkipPolling = createGlobalState<boolean>(false);

export const useGlobalUrlPath = createGlobalState<string>('/user-dashboard');

export const onVehicleModal = createGlobalState<boolean>(false);

export const onPopupModal = createGlobalState<boolean>(false);


export const geVehicleRender = createGlobalState<Partial<Vehicles>>({});
export const getAccountUserRender = createGlobalState<Partial<Account>>({});

export const getScheduleRenderRow = createGlobalState<Partial<Schedules>>({});
export const getVehicleRenderType = createGlobalState<Partial<VehicleType>>({});


export const getPersonalInformation = createGlobalState<Partial<PersonalInformation>>({});


export const getStartEndDateObject = createGlobalState<FilterDateProps>({
  startDate:'',
  endDate:''
});