interface State{
  booking:boolean;
  settings:boolean;
  schedule:boolean;
	wallet:boolean;
}
 type Action =
		| {
				type: 'booking';
		  }
		| {
				type: 'setting';
		  }
		| {
				type: 'schedule';
		  }
		| {
				type: 'wallet';
		  };

export const initialMultipleState: State = {
	booking: false,
	settings: false,
	schedule: false,
	wallet:false,
};


const multipleReducerState = (state: State, action: Action): State => {
	switch (action.type) {
		case 'booking':
			return { ...state, booking: !state.booking, settings: false, schedule: false,wallet:false };
		case 'setting':
			return { ...state, settings: !state.settings, booking: false, schedule: false,wallet:false };
		case 'schedule':
			return { ...state, schedule: !state.schedule, booking: false, settings: false,wallet:false };
		case 'wallet':
			return { ...state, wallet: !state.wallet, booking: false, settings: false,schedule:false };

		default:
			return state;
	}
};

export default multipleReducerState;